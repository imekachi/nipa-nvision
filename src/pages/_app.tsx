import { config as fontAwesomeConfig } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css' // Import fontawesome CSS
import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/global.css'

// Tell Font Awesome to skip adding the CSS automatically since it's being imported above
fontAwesomeConfig.autoAddCss = false

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
