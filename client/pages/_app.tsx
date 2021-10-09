import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { useStore } from '../redux/store'
import Head from 'next/head'
import Layout from '../components/layout'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  const store = useStore(pageProps.initialReduxState)
  return (
    <Provider store={store}>
      <Head>
        <title>Mood Tracker</title>
        <meta name="description" content="Track daily changes to your mood" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}
export default MyApp
