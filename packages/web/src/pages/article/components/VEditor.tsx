import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react'
import Vditor from 'vditor'
import 'vditor/dist/index.css'

interface VditorReactComponentProps {
  ref: any
  id?: string
  value?: string
  onChange?: (value: string) => void
}

let VEditor: React.FC<VditorReactComponentProps> = ({
  id = 'react-vditor-id',
  value = '',
  onChange,
}) => {
  const [isClient, setIsClient] = useState(true)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const vditor = new Vditor('react-vidtor-id', {
      height: 600,
      after: () => {
        vditor.setValue(value)
        onChange && onChange(value)
      },
      input: (string) => {
        onChange && onChange(string)
      },
    })
  }, [onChange, value])

  return <div id={'react-vidtor-id'} className="vditor" />
  return isClient ? <div id={'react-vidtor-id'} className="vditor" /> : null
}
// const VEditorComp = forwardRef(VEditor)

export default VEditor
