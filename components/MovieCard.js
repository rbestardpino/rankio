import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import Link from "next/link";

export default function MovieCard({ movie }) {
  return (
    <Link href={`/rate/${movie.id}`}>
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
