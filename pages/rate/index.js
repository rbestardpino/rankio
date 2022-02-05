import { getMovies } from "@lib/services/tmdb";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from "@mui/material";
import Link from "next/link";

export async function getServerSideProps() {
  const movies = await getMovies({
    sort_by: "popularity.desc",
  });
  return {
    props: { movies: movies }, // will be passed to the page component as props
  };
}

export default function Rate({ movies }) {
  return (
    <main>
      <Container sx={{ mt: 3, mb: 3 }}>
        <Typography variant="h3" mb={3}>
          Pick a movie to rate
        </Typography>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          // columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {movies.map((mov) => (
            <Grid item xs key={mov.id}>
              <MovieCard movie={mov}></MovieCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </main>
  );
}

function MovieCard({ movie }) {
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
