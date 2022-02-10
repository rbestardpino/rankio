import Metatags from "@components/Metatags";
import Review from "@components/Review";
import { UserContext } from "@lib/context";
import { getReview, usernameToUID } from "@lib/services/db";
import {
  FacebookOutlined,
  RateReview,
  Reddit,
  Telegram,
  Twitter,
  WhatsappOutlined,
} from "@mui/icons-material";
import { Button, Container, Grid, Typography } from "@mui/material";
import { useContext } from "react";
import {
  FacebookShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

export async function getServerSideProps({ params }) {
  const { username, reviewId } = params;

  const uid = await usernameToUID(username);
  const review = await getReview(uid, reviewId);
  return {
    props: { username, review },
  };
}

// export async function getStaticPaths() {
//   const usernames = await getUsernames();
//   let paths = [];
//   for (const username of usernames) {
//     const userDoc = await getUserWithUsername(username);
//     const reviews = await getReviewsOf(userDoc.id);
//     if (!reviews) continue;
//     for (const rev of reviews) {
//       paths.push({ params: { username: username, reviewId: rev.id } });
//     }
//   }
//   return {
//     paths: paths,
//     fallback: false,
//   };
// }

export default function ReviewPage({ username, review }) {
  const { username: cUsername } = useContext(UserContext);
  const shareURL = `https://rankio.bepi.tech/${username}/${review.id}`;
  const shareTitle = `Check ${username}'s take on ${review.title}`;

  return (
    <main>
      <Metatags
        title="Review | RankIO"
        description={`${username}'s review of ${review.title}`}
        image={review.image}
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
                {cUsername === username ? "Edit" : "Make your own review"}
              </Button>
            </Grid>
          </Grid>
          <Grid
            item
            xs
            container
            direction="row"
            columnSpacing={2}
            textAlign="center"
          >
            <Grid item xs>
              <TelegramShareButton url={shareURL} title={shareTitle}>
                <Telegram />
              </TelegramShareButton>
            </Grid>
            <Grid item xs>
              <WhatsappShareButton
                url={shareURL}
                title={shareTitle}
                separator=":: "
              >
                <WhatsappOutlined />
              </WhatsappShareButton>
            </Grid>
            <Grid item xs>
              <TwitterShareButton url={shareURL} title={shareTitle}>
                <Twitter />
              </TwitterShareButton>
            </Grid>
            <Grid item xs>
              <FacebookShareButton url={shareURL} quote={shareTitle}>
                <FacebookOutlined />
              </FacebookShareButton>
            </Grid>
            <Grid item xs>
              <RedditShareButton
                url={shareURL}
                title={shareTitle}
                windowWidth={660}
                windowHeight={460}
              >
                <Reddit />
              </RedditShareButton>
            </Grid>
          </Grid>
          <Grid item xs>
            <Review review={review} reviewPage />
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}
