import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography";
import Link from "next/link";

function NewsCard({ news }) {
  const description = (news.description).slice(0, 250) + "....";
  return (
    <Card sx={{ maxWidth: 345 }}>
      <Link href={`/news/${news._id}`} target="_blank">
        <CardMedia
          sx={{ height: 140 }}
          image={news.img}
          title=" "
        />
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
