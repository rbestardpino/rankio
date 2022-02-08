import Metatags from "@components/Metatags";
import Review from "@components/Review";
import { UserContext } from "@lib/context";
import {
  getReview,
  getReviewsOf,
  getUsernames,
  getUserWithUsername,
} from "@lib/services/db";
import { RateReview, Share } from "@mui/icons-material";
import { Button, Container, Grid, Typography } from "@mui/material";
import { useContext } from "react";

export async function getStaticProps({ params }) {
  const { username, reviewId } = params;

  const userDoc = await getUserWithUsername(username);
  const review = await getReview(userDoc.id, reviewId);
  return {
    props: { username, review },
    revalidate: 3600,
  };
}

export async function getStaticPaths() {
  const usernames = await getUsernames();
  let paths = [];
  for (const username of usernames) {
    const userDoc = await getUserWithUsername(username);
    const reviews = await getReviewsOf(userDoc.id);
    if (!reviews) continue;
    for (const rev of reviews) {
      paths.push({ params: { username: username, reviewId: rev.id } });
    }
  }
  return {
    paths: paths,
    fallback: false,
  };
}

export default function ReviewPage({ username, review }) {
  const user = useContext(UserContext);
  return (
    <main>
      <Metatags
        title="Review | RankIO"
        description={`${username}'s review of ${review.title}`}
      />
      <Container sx={{ my: 3 }}>
        <Grid container direction="column" rowSpacing={3}>
          <Grid item xs container direction="row" columnSpacing={2}>
            <Grid item xs={5}>
              <Typography variant="h4">Review</Typography>
            </Grid>
            <Grid item xs={7} textAlign="right">
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<RateReview />}
                href={`/rate/${review.id}`}
              >
                {user.username === username ? "Edit" : "Make your own review"}
              </Button>
            </Grid>
          </Grid>
          <Grid item xs>
            <Review item xs review={review} reviewPage />
          </Grid>
          <Grid item xs>
            <Button
              fullWidth
              variant="outlined"
              color="inherit"
              startIcon={<Share />}
            >
              Share this review
              {/* TODO: make this button useful */}
            </Button>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}
