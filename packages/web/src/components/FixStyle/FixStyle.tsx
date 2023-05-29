import React, { FC, PropsWithChildren, useEffect, useState } from 'react'
import FullScreenSkeleton from 'src/components/FullScreenSkeleton'

const FixStyle: FC<PropsWithChildren> = ({ children }) => {
  const [inited, setInited] = useState(false)
  useEffect(() => {
    setInited(true)
  }, [])
  return <>{inited ? children : <FullScreenSkeleton />}</>
}

export default FixStyle
