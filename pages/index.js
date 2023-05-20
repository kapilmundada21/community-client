import { useRouter } from 'next/router'
import { useEffect } from "react";

export default function Home({ user }) {
  const router = useRouter();

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    try {
      if (!user.token) {
        router.push("/login")
      }
    }
    catch (error) {
      if (!user) {
        router.push("/login")
      }
    }
    router.push("/news")
    // eslint-disable-next-line
  }, []);
  return (
    <>
    </>
  )
}