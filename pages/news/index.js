import Head from 'next/head';
import { useRouter } from 'next/router'
import axios from 'axios';
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
      try {
        const response = await axios.get(`/api/news/get`, {
          params: {
            status: "Approved",
            page: 0,
            offset: offset,
          }
        });
        const parsedData = response.data;
        setAllNews(Array.from(parsedData.allNews));
        setTotalNews(parsedData.totalNews);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }

    fetchData();
    //eslint-disable-next-line
  }, [])

  const updateData = async () => {
    try {
      setLoading(true);
      let URL = `/api/news/get?status=Approved&page=${page + 1}&offset=${offset}`;
      setPage(page + 1);
      const response = await axios.get(URL);
      let parsedData = response.data
      setAllNews(allNews.concat(Array.from(parsedData.allNews)));
      setTotalNews(parsedData.totalNews);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>{`News | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`}</title>
      </Head>

      <div className="md:mx-8 p-3 pt-0 md:p-0">
        <h2 className='my-4 md:mb-8 text-center text-2xl md:text-3xl font-bold'>
          Welcome to Our News
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
            className='mb-4 md:mb-8'
          >
            {Object.keys(allNews).map((news, index) => (
              <Grid item xs={2} sm={4} md={3} key={index} className='flex justify-center'>
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
