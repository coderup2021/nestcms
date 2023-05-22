import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProForm,
  ProFormInstance,
  ProFormDependency,
  ProFormTreeSelect,
} from '@ant-design/pro-components'
import { useIntl, FormattedMessage } from 'react-intl'
import { Form, Input, message, TreeSelect, Upload, UploadProps } from 'antd'
import React, { useCallback, useRef, useState } from 'react'
import { IArticle, IFile, IRes, OPER } from '@cms/server/src/interface'
import { getArticle, getCateList } from '@/http/api'
// import { editorList } from '@/components/Editor'
import { flatToTree } from '@/utils'
import { DeleteOutlined, InboxOutlined } from '@ant-design/icons'
import { postPictures } from '@/http/restful'
import { useSearch } from '@/hooks'
import dynamic from 'next/dynamic'

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: IArticle) => void
  onSubmit: (values: IArticle) => Promise<void>
  modalOpen: boolean
  values: IArticle
  oper: OPER
}

const ArticleForm: React.FC<UpdateFormProps> = (props) => {
  const { id } = useSearch()
  const VEditor = dynamic(() => import('./VEditor'), { ssr: false })
  const [content, setContent] = useState('')
  const editorRef = useRef(null)
  const [newContent, setNewContent] = useState('')
  const contentRef = useRef({ value: '' })
  const requestArticle = async () => {
    if (id) {
      return getArticle(id as number).then((res: IRes<IArticle>) => {
        setContent(res.data.content || '')
        return {
          cateId: res.data.cate?.id,
          ...res.data,
        }
      })
    } else {
      return {}
    }
  }

  const intl = useIntl()
  const formRef = useRef<ProFormInstance | null>(null)

  const { Dragger } = Upload

  const uploadFiles = async (files: FileList) => {
    const results = (await postPictures(
      Array.from(files),
    )) as PromiseSettledResult<IRes<IFile[]>>[]
    console.log('results', results)
    if (results[0].status === 'rejected') {
      message.error(intl.formatMessage({ id: 'pages.article.uploadPicFail' }))
      return
    }
    formRef.current?.setFieldValue(
      'picture',
      results[0].value.data.data[0]?.url,
    )
  }
  const uploadProps: UploadProps = {
    name: 'file',
    onChange(info) {
      uploadFiles([info.file] as any)
    },
    beforeUpload() {
      return false
    },
    async onDrop(e) {
      const files = e.dataTransfer.files
      uploadFiles(files)
    },
  }

  const onSubmit = useCallback(async () => {
    const values = formRef.current?.getFieldsValue()
    await props.onSubmit({ ...values, content: contentRef.current.value })
    props.onCancel()
  }, [newContent])

  return (
    <ProForm<IArticle>
      request={requestArticle}
      style={{ width: '100%' }}
      formRef={formRef}
      size="large"
      initialValues={{ editorType: 1, content: '' }}
      submitter={{
        onSubmit,
        // 配置按钮文本
        searchConfig: {
          resetText: '重置',
          submitText: '提交',
        },
        // 配置按钮的属性
        resetButtonProps: {
          style: {
            // 隐藏重置按钮
            display: 'none',
          },
        },
        submitButtonProps: {},
      }}
    >
      <ProFormText name="id" hidden />
      <ProFormText
        style={{ width: '100%' }}
        name="title"
        required
        placeholder={intl.formatMessage({
          id: 'pages.article.title',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'pages.form.required' }),
          },
        ]}
      />
      <ProFormText name="editorType" hidden />
      <VEditor
        ref={editorRef}
        value={content}
        onChange={(value) => {
          contentRef.current.value = value
        }}
      />

      <ProFormTextArea
        label={<FormattedMessage id={'pages.article.description'} />}
        name="description"
        fieldProps={{
          placeholder: intl.formatMessage({
            id: 'pages.article.descriptionPlaceholder',
          }),
        }}
        style={{ width: '100%' }}
      />

      <ProFormTreeSelect
        name="cateId"
        request={async () => getCateList().then(({ data }) => flatToTree(data))}
        fieldProps={{
          placeholder: intl.formatMessage({
            id: 'pages.article.catePlaceholder',
          }),
          treeDefaultExpandAll: true,
          showCheckedStrategy: TreeSelect.SHOW_PARENT,
          fieldNames: { value: 'id', label: 'name' },
        }}
      />
      <ProFormText name="picture" hidden />
      <ProFormDependency name={['_', ['picture']]}>
        {({ picture }) => {
          return picture ? (
            <div className={'upload-preview-box'}>
              <DeleteOutlined
                className={'del-icon'}
                onClick={() => {
                  formRef.current?.setFieldValue('picture', void 0)
                }}
              />
              <img src={picture} />
            </div>
          ) : (
            <Dragger
              {...uploadProps}
              style={{ background: '#fff', marginBottom: 20 }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                <FormattedMessage id={'pages.article.uploadPicPlaceholder'} />
              </p>
            </Dragger>
          )
        }}
      </ProFormDependency>
      <Form.Item label="标签" name="tags" wrapperCol={{ span: 16 }} hidden>
        <Input />
      </Form.Item>
    </ProForm>
  )
}

export default ArticleForm
