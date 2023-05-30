import {
  IArticle,
  IArticleList,
  Id,
  OPER,
  UrlQueryParam,
} from 'src/interface'
import {
  putArticle,
  postArticle,
  delArticle,
  getArticleList,
  getCateList,
} from 'src/http/api'
import {
  DeleteFilled,
  EditOutlined,
  LeftOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import {
  ActionType,
  ProColumns,
  ProFormTreeSelect,
} from '@ant-design/pro-components'
import {
  FooterToolbar,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, message, Tooltip, TreeSelect } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import ArticleForm from './components/ArticleForm'
import { useSearch } from '@/hooks'
import { useArticleStore } from 'src/store/articleStore'
import { useRouter } from 'next/router'
import { ParsedUrlQueryInput } from 'querystring'

export interface QueryOption {
  current?: number
  pageSize?: number
  order?: 'asc' | 'dsc'
}

const TableList: React.FC = () => {
  const { total, data, dataMap, fetchData, setCurrent, setPageSize } =
    useArticleStore((s) => ({
      total: s.total,
      data: s.data,
      dataMap: s.dataMap,
      fetchData: s.fetchData,
      setCurrent: s.setCurrent,
      setPageSize: s.setPageSize,
    }))

  useEffect(() => {
    fetchData()
    //eslint-disable-next-line
  }, [])

  const router = useRouter()
  const push = (oper: OPER, id?: Id) => {
    let obj: UrlQueryParam = {}
    if (oper !== OPER.NONE) {
      obj.oper = oper
      if (id) obj.id = id
    }

    router.push({ query: obj as ParsedUrlQueryInput })
  }

  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const actionRef = useRef<ActionType>()
  const [currentRow, setCurrentRow] = useState<IArticle>()
  const [selectedRowsState, setSelectedRows] = useState<IArticleList>([])

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl()
  const { oper } = useSearch()

  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
  const handleAdd = async (fields: IArticle) => {
    const hide = message.loading(
      intl.formatMessage({ id: 'pages.operate.doing' }),
    )
    try {
      await postArticle({ ...fields })
      message.success(intl.formatMessage({ id: 'pages.operate.success' }))
    } finally {
      hide()
    }
  }

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields: IArticle) => {
    const hide = message.loading(
      intl.formatMessage({ id: 'pages.operate.doing' }),
    )
    try {
      await putArticle(fields)
      message.success(intl.formatMessage({ id: 'pages.operate.success' }))
    } finally {
      hide()
    }
  }

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param selectedRows
   */
  const handleRemove = async (selectedRows: IArticle[]) => {
    const hide = message.loading(
      intl.formatMessage({ id: 'pages.operate.doing' }),
    )
    if (!selectedRows) return true
    try {
      const ids = selectedRows.map((row) => row.id).join(',')
      await delArticle(ids)
      message.success(intl.formatMessage({ id: 'pages.operate.success' }))
    } finally {
      hide()
    }
  }

  const columns: ProColumns<IArticle>[] = [
    {
      title: (
        <FormattedMessage id="pages.article.title" defaultMessage="Title" />
      ),
      dataIndex: 'title',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity)
            }}
          >
            {dom}
          </a>
        )
      },
    },
    {
      title: (
        <FormattedMessage id="pages.article.cate" defaultMessage="Category" />
      ),
      key: 'cateId',
      renderText: (_: string, row) => row.cate?.name,
      renderFormItem: ({ type }) => {
        if (type === 'form') {
          return null
        }
        return (
          <ProFormTreeSelect
            allowClear
            fieldProps={{
              treeDefaultExpandAll: true,
              showCheckedStrategy: TreeSelect.SHOW_PARENT,
              fieldNames: { value: 'id', label: 'name' },
              style: { minWidth: 200 },
            }}
          />
        )
      },
    },
    {
      title: (
        <FormattedMessage id="pages.article.labels" defaultMessage="Labels" />
      ),
      hideInForm: true,
      hideInSearch: true,
      renderText: () => '',
    },
    {
      title: (
        <FormattedMessage
          id="pages.article.clickCount"
          defaultMessage="Click Count"
        />
      ),
      hideInForm: true,
      hideInSearch: true,
      renderText: () => 0,
    },
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.lastUpdatedAt"
          defaultMessage="Last Update"
        />
      ),
      dataIndex: 'updatedAt',
      sorter: true,
      hideInForm: true,
      hideInSearch: true,
      renderText: (val: string) => val?.split('.')[0],
    },
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.titleOption"
          defaultMessage="Operating"
        />
      ),
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            push(OPER.EDIT, record.id)
            setCurrentRow(record)
          }}
          style={{ display: 'inline-block', padding: '0 10px' }}
        >
          <Tooltip
            color="#1890ff"
            title={
              <FormattedMessage
                id="pages.searchTable.modify"
                defaultMessage="Modify"
              />
            }
          >
            <EditOutlined />
          </Tooltip>
        </a>,
        <a
          key="delete"
          onClick={() => {
            handleRemove([{ id: record.id }])
            actionRef.current?.reloadAndRest?.()
          }}
          style={{ display: 'inline-block', padding: '0 10px' }}
        >
          <Tooltip
            color="#1890ff"
            title={
              <FormattedMessage
                id="pages.searchTable.delete"
                defaultMessage="Delete"
              />
            }
          >
            <DeleteFilled color={''} />
          </Tooltip>
        </a>,
      ],
    },
  ]

  return (
    <>
      {oper === OPER.ADD || oper === OPER.EDIT ? (
        <PageContainer
          header={{ title: '' }}
          tabList={[
            {
              tab: (
                <span onClick={() => push(OPER.NONE)}>
                  <LeftOutlined />
                  <FormattedMessage id={'pages.article.return'} />
                </span>
              ),
              key: 'return',
              closable: false,
            },
            {
              tab: intl.formatMessage({
                id:
                  oper === OPER.ADD
                    ? 'pages.article.new'
                    : 'pages.article.edit',
              }),
              key: 'main',
              closable: false,
            },
          ]}
          tabProps={{
            type: 'editable-card',
            hideAdd: true,
            activeKey: 'main',
          }}
        >
          <ArticleForm
            onSubmit={async (value: IArticle) => {
              if (value.id) {
                await handleUpdate(value)
              } else {
                await handleAdd(value)
              }
              setCurrentRow(undefined)
              if (actionRef.current) {
                actionRef.current.reload()
              }
            }}
            onCancel={() => {
              push(OPER.NONE)
            }}
            modalOpen={oper === OPER.ADD || oper === OPER.EDIT}
            oper={oper}
            values={currentRow || {}}
          />
        </PageContainer>
      ) : (
        <PageContainer
          header={{
            ghost: true,
            breadcrumb: {
              items: [
                {
                  path: '/article',
                  title: '文章列表',
                },
              ],
            },
          }}
        >
          <ProTable<IArticle, QueryOption>
            headerTitle={intl.formatMessage({
              id: 'pages.searchTable.title',
              defaultMessage: 'Enquiry form',
            })}
            actionRef={actionRef}
            rowKey="id"
            search={{
              labelWidth: 120,
            }}
            toolBarRender={() => [
              <Button
                type="primary"
                key="primary"
                onClick={() => {
                  push(OPER.ADD)
                  setCurrentRow({})
                }}
              >
                <PlusOutlined />{' '}
                <FormattedMessage
                  id="pages.searchTable.new"
                  defaultMessage="New"
                />
              </Button>,
            ]}
            dataSource={data }
            columns={columns}
            rowSelection={{
              onChange: (_, selectedRows) => {
                setSelectedRows(selectedRows)
              },
            }}
            pagination={{
              total: total,
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50, 100, 200, 500],
              onChange(page, pageSize) {
                setCurrent(page)
                setPageSize(pageSize)
                fetchData()
              },
            }}
            options={{
              reload: () => {
                fetchData()
              },
            }}
          />
          {selectedRowsState?.length > 0 && (
            <FooterToolbar
              extra={
                <div>
                  <FormattedMessage
                    id="pages.searchTable.chosen"
                    defaultMessage="Chosen"
                  />{' '}
                  <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
                  <FormattedMessage
                    id="pages.searchTable.item"
                    defaultMessage="项"
                  />
                </div>
              }
            >
              <Button
                onClick={async () => {
                  await handleRemove(selectedRowsState)
                  setSelectedRows([])
                  actionRef.current?.reloadAndRest?.()
                }}
              >
                <FormattedMessage
                  id="pages.searchTable.batchDeletion"
                  defaultMessage="Batch deletion"
                />
              </Button>
            </FooterToolbar>
          )}
        </PageContainer>
      )}
    </>
  )
}

export default TableList
