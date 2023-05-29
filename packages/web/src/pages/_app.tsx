import '@/styles/globals.scss'
import 'src/pages/article/components/ArticleForm.scss'
import type { AppProps } from 'next/app'
import { IntlProvider } from 'react-intl'
import cn from 'src/locales/zh-CN'
import Layout from '@/components/Layout'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'antd/dist/reset.css'
import FixStyle from '@/components/FixStyle'
import Auth from '@/components/Auth/Auth'

export default function App({ Component, pageProps }: AppProps) {
  console.log('_app>>>>>>>>>>>>>>>>>>>..')
  return (
    <IntlProvider messages={cn} locale="fr" defaultLocale="en">
      <FixStyle>
        <Auth>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Auth>
      </FixStyle>
    </IntlProvider>
  )
}
