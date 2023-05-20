import Navbar from '@/components/Navbar';
import '@/styles/globals.css'
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
