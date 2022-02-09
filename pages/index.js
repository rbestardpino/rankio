import Metatags from "@components/Metatags";
import MovieCard from "@components/MovieCard";
import ReviewsList from "@components/ReviewsList";
import { getTopMovies } from "@lib/services/tmdb";
import { RateReview } from "@mui/icons-material";
import { Button, Container, Grid, Typography } from "@mui/material";
import { useState } from "react";

export async function getStaticProps() {
  const recommendedMovies = await getTopMovies({});
  return {
    props: { recommendedMovies },
  };
}

export default function Home({ recommendedMovies }) {
  return (
    <main>
      <Metatags />
      <Container sx={{ my: 4 }}>
        <Grid container direction="row" columnSpacing={5} rowSpacing={5}>
          <Grid item xs={12} md={8}>
            <YourReviews></YourReviews>
          </Grid>
          <Grid item xs={12} md={4}>
            <Recommendation recommendedMovies={recommendedMovies} />
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}

function Recommendation({ recommendedMovies }) {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    if (index === recommendedMovies.length - 1) setIndex(0);
    else setIndex(index + 1);
  };

  return (
    <Grid container direction="column" rowSpacing={3}>
      <Grid item xs>
        <Typography variant="h5">What to see next</Typography>
      </Grid>
      <Grid item xs container alignContent="start" justifyContent="center">
        <MovieCard movie={recommendedMovies[index]}></MovieCard>
      </Grid>
      <Grid item xs textAlign="center">
        <Button
          variant="outlined"
          fullWidth
          color="inherit"
          onClick={handleNext}
        >
          Next recommendation
        </Button>
      </Grid>
    </Grid>
  );
}

function YourReviews() {
  return (
    <Grid container direction="column" rowSpacing={3}>
      <Grid item xs container direction="row">
        <Grid item xs={7}>
          <Typography variant="h5">Your reviews</Typography>
        </Grid>
        <Grid item xs={5} container justifyContent="flex-end">
          <Button
            variant="outlined"
            color="inherit"
            href="/rate"
            startIcon={<RateReview />}
          >
            Rate a movie
          </Button>
        </Grid>
      </Grid>
      <Grid item xs>
        <ReviewsList></ReviewsList>
      </Grid>
    </Grid>
  );
}
