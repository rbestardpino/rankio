import Loader from "@components/Loader";
import Metatags from "@components/Metatags";
import MovieCard from "@components/MovieCard";
import ReviewsList from "@components/ReviewsList";
import { Movie } from "@lib/models";
import { getTopMovies } from "@lib/services/tmdb";
import { RateReview } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useUserData } from "providers/UserProvider";
import { useEffect, useState } from "react";

export const getStaticProps: GetStaticProps = async () => {
  const recommendedMovies = await getTopMovies({});
  return {
    props: { recommendedMovies },
  };
};

interface Props {
  recommendedMovies: Movie[];
}

export default function Home({ recommendedMovies }: Props) {
  const router = useRouter();
  const { user, loading } = useUserData();

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user]);

  return loading ? (
    <Loader />
  ) : (
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

function Recommendation({ recommendedMovies }: Props) {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    if (index === recommendedMovies.length - 1) setIndex(0);
    else setIndex(index + 1);
  };

  return (
    <Grid container direction="column" rowSpacing={3}>
      <Grid item xs>
        <Typography variant="h5">Top movies</Typography>
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
          Next
        </Button>
      </Grid>
    </Grid>
  );
}

function YourReviews() {
  const { reviews } = useUserData();

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
        <ReviewsList reviews={reviews}></ReviewsList>
      </Grid>
    </Grid>
  );
}
