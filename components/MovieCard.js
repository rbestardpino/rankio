import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import Link from "next/link";

export default function MovieCard({ movie }) {
  movie.original_title =
    movie.language === "en" ? movie.original_title : movie.title;
  return (
    <Link href={`/rate/${movie.id}`} passHref>
      <Card sx={{ width: 250 }} variant="outlined">
        <CardActionArea>
          <CardMedia
            component="img"
            image={movie.image}
            alt={`${movie.original_title}'s poster`}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {movie.original_title}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}
