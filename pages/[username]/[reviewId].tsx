import Metatags from "@components/Metatags";
import Review from "@components/Review";
import { UserContext } from "@lib/context";
import { Review as IReview, reviewFromFirestore } from "@lib/models";
import { db } from "@lib/services/firebase";
import FacebookOutlined from "@mui/icons-material/FacebookOutlined";
import RateReview from "@mui/icons-material/RateReview";
import Reddit from "@mui/icons-material/Reddit";
import Telegram from "@mui/icons-material/Telegram";
import Twitter from "@mui/icons-material/Twitter";
import WhatsappOutlined from "@mui/icons-material/WhatsappOutlined";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { useContext } from "react";
import {
  FacebookShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

interface Params extends ParsedUrlQuery {
  username: string;
  reviewId: string;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { username: author, reviewId } = context.params as Params;

  const usernameDoc = await getDoc(doc(db, "usernames", author));
  const uid = usernameDoc.exists() ? usernameDoc.data().uid : null;

  if (!uid)
    return {
      notFound: true,
    };

  const reviewDoc = await getDoc(doc(db, `users/${uid}/reviews/${reviewId}`));

  if (!reviewDoc.exists())
    return {
      notFound: true,
    };

  const review: IReview = reviewFromFirestore(reviewDoc);

  return {
    props: { author, review },
    revalidate: 3600,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // const reviewsSnap = await getDocs(query(collectionGroup(db, "reviews")));

  // const paths = [];
  // reviewsSnap.forEach((reviewDoc) => {
  //   paths.push({
  //     params: {
  //       author: reviewDoc.data().author,
  //       reviewId: reviewDoc.id,
  //     },
  //   });
  // });
  // Optimized version ^^^^ make the same with getStaticProps

  const qSnap = await getDocs(query(collection(db, "usernames")));
  const usernames: string[] = qSnap.docs.map((doc) => doc.id);

  const paths = [];
  for (const username of usernames) {
    const userDoc = (
      await getDocs(
        query(
          collection(db, "users"),
          where("username", "==", username),
          limit(1)
        )
      )
    ).docs[0];

    const reviewsSnap = await getDocs(
      query(
        collection(db, `users/${userDoc.id}/reviews`),
        orderBy("createdAt", "desc")
      )
    );
    const reviews: IReview[] = reviewsSnap.empty
      ? []
      : reviewsSnap.docs.map(reviewFromFirestore);

    if (!reviews.length) continue;

    for (const rev of reviews) {
      paths.push({ params: { username: username, reviewId: rev.id } });
    }
  }

  return {
    paths: paths,
    fallback: "blocking",
  };
};

interface Props {
  author: string;
  review: IReview;
}

export default function ReviewPage({ author, review }: Props) {
  const { user } = useContext(UserContext);
  const shareURL = `https://rankio.bepi.tech/${author}/${review.id}`;
  const shareTitle = `Check ${author}'s take on ${review.movie.title}`;

  return (
    <main>
      <Metatags
        title="Review | RankIO"
        description={`${author}'s review of ${review.movie.title}`}
        image={review.movie.image}
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
                {user?.username === author ? "Edit" : "Make your own review"}
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
                separator=" "
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