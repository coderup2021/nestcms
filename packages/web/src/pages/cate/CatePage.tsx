import {
  ICate,
  ICateList,
  QueryOption,
  OPER,
  UrlQueryParam,
  Id,
} from 'src/interface'
import { putCate, postCate, delCate, getCateList } from '@/http/api'
import { DeleteFilled, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns } from '@ant-design/pro-components'
import {
  FooterToolbar,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, message, Tooltip } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import CateForm from './components/CateForm'
import { useSearch } from '@/hooks'
import { getIdPath } from '@/utils'
import { useCateStore } from 'src/store/cateStore'
import { useRouter } from 'next/router'
import { ParsedUrlQueryInput } from 'querystring'

const TableList: React.FC = () => {
  const { total, data, treeData, dataMap, fetchData, setCurrent, setPageSize } =
    useCateStore((s) => ({
      total: s.total,
      data: s.data,
      treeData: s.treeData,
      dataMap: s.dataMap,
      fetchData: s.fetchData,
      setCurrent: s.setCurrent,
      setPageSize: s.setPageSize,
    }))

  useEffect(() => {
    fetchData()
    //eslint-disable-next-line
  }, [])

  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const actionRef = useRef<ActionType>()
  const [currentRow, setCurrentRow] = useState<ICate>()
  const [selectedRowsState, setSelectedRows] = useState<ICateList>([])

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
  const handleAdd = async (fields: ICate) => {
    const hide = message.loading(
      intl.formatMessage({ id: 'pages.operate.doing' }),
    )
    try {
      fields.path = getIdPath<ICate>(fields.parentId || 0, treeData)
      await postCate({ ...fields })
      message.success(intl.formatMessage({ id: 'pages.operate.success' }))
      fetchData()
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
  const handleUpdate = async (fields: ICate) => {
    const hide = message.loading(
      intl.formatMessage({ id: 'pages.operate.doing' }),
    )
    try {
      fields.path = getIdPath<ICate>(fields.parentId || 0, treeData)
      await putCate(fields)
      message.success(intl.formatMessage({ id: 'pages.operate.success' }))
      fetchData()
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
  const handleRemove = async (selectedRows: ICate[]) => {
    const hide = message.loading(
      intl.formatMessage({ id: 'pages.operate.doing' }),
    )
    if (!selectedRows) return true
    try {
      const ids = selectedRows.map((row) => row.id).join(',')
      await delCate(ids)
      message.success(intl.formatMessage({ id: 'pages.operate.success' }))
    } finally {
      hide()
    }
  }

  const router = useRouter()
  const push = (oper: OPER, id?: Id) => {
    let obj: UrlQueryParam = {}
    if (oper !== OPER.NONE) {
      obj.oper = oper
      if (id) obj.id = id
    }

    router.push({ query: obj as ParsedUrlQueryInput })
  }

  const columns: ProColumns<ICate>[] = [
    {
      title: <FormattedMessage id="pages.cate.name" defaultMessage="name" />,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: <FormattedMessage id="pages.cate.id" defaultMessage="ID" />,
      key: 'id',
      dataIndex: 'id',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.cate.parentCate"
          defaultMessage="Parent Category"
        />
      ),
      hideInForm: true,
      hideInSearch: true,
      render(_, record) {
        return record.path
          ?.split('/')
          .filter((d) => d !== '' && d !== '0' && d)
          .map((id) => dataMap[id]?.name || '')
          .filter((d) => !!d)
          .join('>')
      },
      key: 'parentId',
    },
    {
      title: (
        <FormattedMessage
          id="pages.cate.articleCount"
          defaultMessage="Article Count"
        />
      ),
      hideInForm: true,
      hideInSearch: true,
      key: 'articleCount',
      renderText() {
        return 0
      },
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
      <PageContainer
        header={{
          ghost: true,
          breadcrumb: {
            items: [
              {
                path: '/cate',
                title: '文章列表',
              },
            ],
          },
        }}
      >
        <ProTable<ICate, QueryOption>
          headerTitle={intl.formatMessage({
            id: 'pages.searchTable.title',
            defaultMessage: 'Enquiry form',
          })}
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: 120,
          }}
          // request={getCateList}
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
          dataSource={data}
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
            reload: function () {
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
      <CateForm
        cateTree={treeData}
        onSubmit={async (value: ICate) => {
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
          setCurrentRow(undefined)
        }}
        modalOpen={oper === OPER.ADD || oper === OPER.EDIT}
        oper={oper || OPER.ADD}
        values={currentRow || {}}
      />
    </>
  )
}

export default TableList
