import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/global.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          key="favicon"
          rel="shortcut icon"
          href="https://mirror.nipa.cloud/nipacloud_logo/favicon.png"
        />
        <link
          key="google-font"
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
