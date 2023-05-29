import { clearAuthToken } from '@/utils/store'
import { Button } from 'antd'
import React, { useCallback } from 'react'

const Logout = () => {
  const logout = useCallback(() => {
    clearAuthToken()
    //router && router.push('/login')
    window.location.reload()
  }, [])
  return (
    <Button type="primary" onClick={logout}>
      退出
    </Button>
  )
}

export default Logout
