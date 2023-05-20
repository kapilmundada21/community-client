import { useRouter } from 'next/router'
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import NewsCard from '@/components/NewsCard';
import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress } from '@material-ui/core';

export default function NewsLetter() {
  const router = useRouter();
  const [allNews, setAllNews] = useState([]);
  const [page, setPage] = useState(0);
  const [offset, setOffset] = useState(8);
  const [totalNews, setTotalNews] = useState(8);
  const [loading, setLoading] = useState(true);

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
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    async function fetchData() {
      let URL = `${process.env.NEXT_PUBLIC_HOST}/api/news/get?status=Approved&page=${page}&offset=${offset}`
      let data = await fetch(URL);
      let parsedData = await data.json();
      await setAllNews(Array.from(parsedData.allNews));
      await setTotalNews(parsedData.totalNews);
      setLoading(false);
    }
    fetchData();
    //eslint-disable-next-line
  }, [])

  const updateData = async () => {
    setLoading(true);
    let url = `${process.env.NEXT_PUBLIC_HOST}/api/news/get?status=Approved&page=${page + 1}&offset=${offset}`;
    setPage(page + 1);
    let data = await fetch(url);
    let parsedData = await data.json();
    setAllNews(allNews.concat(Array.from(parsedData.allNews)));
    setTotalNews(parsedData.totalNews);
    setLoading(false);
  }

  return (
    <>
      <div className="md:mx-8 p-3">
        <h2 className='my-4 md:mb-8 text-center text-xl md:text-3xl font-bold'>
          Welcome to Our News Letter
        </h2>

        <InfiniteScroll
          dataLength={(page + 1) * offset}
          next={updateData}
          hasMore={((page + 1) * offset) <= totalNews}
        >
          <Grid
            container
            spacing={{ xs: 2, md: 5 }}
            columns={{ xs: 1, sm: 8, md: 12 }}
          >
            {Object.keys(allNews).map((news, index) => (
              <Grid item xs={2} sm={4} md={3} key={index}>
                <NewsCard news={allNews[index]} />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>

        {loading && (
          <div className="flex justify-center mt-5">
            <CircularProgress />
          </div>
        )}

      </div>
    </>
  )
}
