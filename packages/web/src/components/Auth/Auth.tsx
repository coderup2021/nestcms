import { useGlobalStore } from '@/globalStore'
import Login from '@/pages/login'
import React, { FC, PropsWithChildren, useEffect, useState } from 'react'
import FullScreenSkeleton from 'src/components/FullScreenSkeleton'
import { useMount } from 'ahooks'
import { useRouter } from 'next/navigation'

const Auth: FC<PropsWithChildren> = ({ children }) => {
  const authed = useGlobalStore(s => s.authed)
  const fetchAuth = useGlobalStore(s => s.fetchAuth)
  useMount(() => { console.log('before fetchAuth'); fetchAuth() })
  const router = useRouter()
  if (authed === false ) {
    router && router.push('/login')
  }

  return <>{authed === null ? <FullScreenSkeleton /> : authed === true ? children : <Login />}</>
}

export default Auth
