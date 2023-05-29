import {
  ProFormText,
  ProFormInstance,
  ProFormTreeSelect,
  ModalForm,
} from '@ant-design/pro-components'
import { useIntl } from 'react-intl'
import { TreeSelect } from 'antd'
import React, { useCallback, useEffect, useRef } from 'react'
import { ICate, OPER } from '@cms/server/src/interface'
import { addRootNode } from '@/utils'

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: ICate) => void
  onSubmit: (values: ICate) => Promise<void>
  modalOpen: boolean
  values: ICate
  oper: OPER
  cateTree: ICate[]
}

const CateForm: React.FC<UpdateFormProps> = (props) => {
  const { values, cateTree, oper, onCancel, onSubmit } = props
  const formRef = useRef<ProFormInstance | null>(null)

  useEffect(() => {
    if (!formRef.current?.setFieldsValue) return
    if (values.id) {
      formRef.current?.setFieldsValue(values)
    } else {
      formRef.current?.resetFields()
    }
  }, [values])

  const intl = useIntl()

  const getModalTitle = useCallback(() => {
    return oper === OPER.ADD
      ? intl.formatMessage({
          id: 'pages.cate.new',
          defaultMessage: 'New Category',
        })
      : oper === OPER.EDIT
      ? intl.formatMessage({
          id: 'pages.cate.edit',
          defaultMessage: 'Modify Category',
        })
      : null
  }, [oper, intl])
  return (
    <ModalForm<ICate>
      width={500}
      title={getModalTitle()}
      formRef={formRef}
      size="large"
      initialValues={{}}
      open={oper !== OPER.NONE}
      onOpenChange={(value) => {
        if (!value) onCancel()
      }}
      onFinish={async () => {
        const values = formRef.current?.getFieldsValue()
        await props.onSubmit({ ...values })
        onCancel()
      }}
      submitter={{
        searchConfig: {
          resetText: intl.formatMessage({ id: 'pages.form.cancel' }),
          submitText: intl.formatMessage({ id: 'pages.form.save' }),
        },
        onReset: async () => {
          onCancel()
        },
      }}
    >
      <ProFormText name="id" hidden />
      <ProFormText
        style={{ width: '100%' }}
        name="name"
        required
        placeholder={intl.formatMessage({
          id: 'pages.cate.name',
        })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'pages.form.required' }),
          },
        ]}
      />

      <ProFormTreeSelect
        name="parentId"
        placeholder={intl.formatMessage({ id: 'pages.cate.parentCate' })}
        fieldProps={{
          treeDefaultExpandAll: true,
          showCheckedStrategy: TreeSelect.SHOW_PARENT,
          fieldNames: { value: 'id', label: 'name' },
          treeData: addRootNode(cateTree || []),
        }}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'pages.form.required' }),
          },
        ]}
      />
    </ModalForm>
  )
}

export default CateForm
