import Metatags from "@components/Metatags";
import { Button, Container, Grid, Typography } from "@mui/material";
import { RateReview } from "@mui/icons-material";
import ReviewsList from "@components/ReviewsList";
import MovieCard from "@components/MovieCard";
import posternotfound from "../public/posternotfound.png";

export default function Home() {
  return (
    <main>
      <Metatags />
      <Container sx={{ mt: 4 }}>
        <Grid container direction="row" columnSpacing={5} rowSpacing={5}>
          <Grid item xs={12} md={8}>
            <YourReviews></YourReviews>
          </Grid>
          <Grid item xs={12} md={4}>
            <Recommendation />
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}

function Recommendation() {
  return (
    <Grid container direction="column" rowSpacing={3}>
      <Grid item xs>
        <Typography variant="h5">What to see next</Typography>
      </Grid>
      <Grid item xs container alignContent="start" justifyContent="center">
        <MovieCard
          movie={{
            image: posternotfound.src,
            original_title: "Recommendation",
          }}
        ></MovieCard>
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
