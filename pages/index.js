import Metatags from "@components/Metatags";
import { Button, Container, Grid, Typography } from "@mui/material";
import { RateReview } from "@mui/icons-material";
import ReviewsList from "@components/ReviewsList";

export default function Home() {
  return (
    <main>
      <Metatags />
      <Container sx={{ mt: 4 }}>
        <Grid container direction="row" columnSpacing={5}>
          <Grid item xs={8}>
            <YourReviews></YourReviews>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h5">What to see next</Typography>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}

function YourReviews() {
  return (
    <Grid container direction="column" rowSpacing={3}>
      <Grid item container direction="row">
        <Grid item xs={9}>
          <Typography variant="h5">Your reviews</Typography>
        </Grid>
        <Grid item xs={3} container justifyContent="flex-end">
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
