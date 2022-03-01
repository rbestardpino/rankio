import Metatags from "@components/Metatags";
import RatingSlider from "@components/RatingSlider";
import { UserContext } from "@lib/context";
import { Review as IReview, reviewFromFirestore } from "@lib/models";
import { db } from "@lib/services/firebase";
import { shimmer, toBase64 } from "@lib/utils";
import FacebookOutlined from "@mui/icons-material/FacebookOutlined";
import RateReview from "@mui/icons-material/RateReview";
import Reddit from "@mui/icons-material/Reddit";
import Telegram from "@mui/icons-material/Telegram";
import Twitter from "@mui/icons-material/Twitter";
import WhatsappOutlined from "@mui/icons-material/WhatsappOutlined";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { collectionGroup, getDocs, query, where } from "firebase/firestore";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
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

  const reviewsSnap = await getDocs(
    query(collectionGroup(db, "reviews"), where("author", "==", author))
  );

  const reviewDoc = reviewsSnap.docs.find((doc) => doc.id === reviewId);

  if (!reviewDoc)
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
  const reviewsSnap = await getDocs(query(collectionGroup(db, "reviews")));

  const paths: { params: { username: string; reviewId: string } }[] = [];
  reviewsSnap.forEach((reviewDoc) => {
    paths.push({
      params: {
        username: reviewDoc.data().author,
        reviewId: reviewDoc.id,
      },
    });
  });

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
        image={review.movie.poster}
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
            direction="column"
            rowSpacing={3}
            justifyContent="flex-start"
            alignItems="stretch"
            mb={5}
          >
            <Grid item xs textAlign="center">
              <Image
                src={review.movie.backdrop}
                alt={`${review.movie.title}'s backdrop poster`}
                height={393}
                width={700}
                priority
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                  shimmer(700, 393)
                )}`}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="h5">{review.movie.title}</Typography>
            </Grid>
            <Grid item xs my={3}>
              <RatingSlider value={review.rating} readOnly />
            </Grid>
            <Paper variant="elevation" elevation={5}>
              <Grid item xs m={2}>
                <Typography variant="body2">{review.review}</Typography>
              </Grid>
            </Paper>
          </Grid>
          <Divider>Share this review</Divider>
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
        </Grid>
      </Container>
    </main>
  );
}
