import '@/styles/globals.css'
import Navbar from '@/components/Navbar';
import Head from 'next/head';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [key, setKey] = useState()

  const logout = () => {
    localStorage.removeItem('user')
    setKey(Math.random())
    router.push('/login')
  }

  useEffect(() => {

    setKey(Math.random())
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query])

  return <>
    <Head>
      <title>{process.env.NEXT_PUBLIC_WEBSITE_NAME}</title>
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
      <link rel="manifest" href="/favicon/site.webmanifest" />
    </Head>

    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />

    {key && <Navbar key={key} logout={logout} />}
    <Component {...pageProps} />
  </>
}
