import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Link from "next/link";
const CardMedia = dynamic(() => import('@mui/material/CardMedia'));

function NewsCard({ news }) {
  const description = (news.description).slice(0, 250) + "....";
  return (
    <Card sx={{ maxWidth: 345 }}>
      <Link href={`/news/${news._id}`} target="_blank">
      <Suspense>
        <CardMedia
          sx={{ height: 140 }}
          image={news.img}
        />
        </Suspense>
        <CardContent>
          <Typography gutterBottom variant="b" component="b" className="hover:underline">
            {news.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} dangerouslySetInnerHTML={{ __html: description}} />
        </CardContent>
      </Link>
    </Card>
  );
}

export default NewsCard;
