import Metatags from "@components/Metatags";
import PersonalFav from "@components/PersonalFav";
import RateModal from "@components/RateModal";
import Rating from "@components/Rating";
import ShareReviewButtons from "@components/ShareReviewButtons";
import { UserContext } from "@lib/context";
import { Review as IReview, reviewFromFirestore } from "@lib/models";
import { db } from "@lib/services/firebase";
import { shimmer, toBase64 } from "@lib/utils";
import RateReview from "@mui/icons-material/RateReview";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {
  collectionGroup,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import { useContext, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";

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
    props: { reviewDocPath: reviewDoc.ref.path, review },
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
  reviewDocPath: string;
  review: IReview;
}

export default function ReviewPage({ reviewDocPath, review }: Props) {
  const { user } = useContext(UserContext);
  const [openRateDialog, setOpenRateDialog] = useState(false);
  const [realtimeReview] = useDocumentData(doc(db, reviewDocPath));

  review = realtimeReview
    ? {
        id: review.id,
        author: realtimeReview.author,
        rating: realtimeReview.rating,
        review: realtimeReview.review,
        personalFav: realtimeReview.personalFav,
        movie: {
          id: review.id,
          backdrop: realtimeReview.movie.backdrop,
          poster: realtimeReview.movie.poster,
          title: realtimeReview.movie.title,
        },
        lastEdit: realtimeReview.lastEdit?.toMillis() || 0,
        createdAt: realtimeReview.createdAt?.toMillis() || 0,
      }
    : review;

  const shareURL = `https://rankio.bepi.tech/${review.author}/${review.id}`;
  const shareTitle = `Check ${review.author}'s take on ${review.movie.title}`;

  return (
    <main>
      <Metatags
        title={`${review.author}'s review of ${review.movie.title} in RankIO`}
        description={`Discover what ${review.author} says about ${review.movie.title}: "${review.review}"`}
        image={review.movie.backdrop}
        ogEndpoint={`/${review.author}/${review.id}`}
        ogType="article"
        articleAuthor={review.author}
        articleTag={review.movie.title}
        articlePublishedTime={review.createdAt}
        articleEditedTime={review.lastEdit}
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
                onClick={() => setOpenRateDialog(true)}
              >
                {user?.username === review.author
                  ? "Edit"
                  : "Make your own review"}
              </Button>
              <RateModal
                movie={review.movie}
                open={openRateDialog}
                handleClose={() => setOpenRateDialog(false)}
              />
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
            <Grid item xs my={3} container direction="row" columnSpacing={2}>
              <Grid item xs={10} sm={11}>
                <Rating value={review.rating} readOnly author={review.author} />
              </Grid>
              <Grid item xs={2} sm={1} textAlign="center">
                <PersonalFav readOnly checked={review.personalFav} />
              </Grid>
            </Grid>
            <Paper variant="elevation" elevation={5}>
              <Grid item xs m={2}>
                <Typography variant="body2" fontFamily="Average">
                  {review.review}
                </Typography>
              </Grid>
            </Paper>
            <Grid item xs textAlign="right" my={-3}>
              <Link href={`/${review.author}`} passHref>
                <Typography
                  variant="caption"
                  fontSize={10}
                  fontWeight="bold"
                  sx={{ cursor: "pointer" }}
                >
                  @{review.author}
                </Typography>
              </Link>
              <Typography variant="caption" fontSize={10}>{` on ${new Date(
                review.createdAt
              ).toLocaleString()} `}</Typography>
              {review.createdAt !== review.lastEdit && (
                <Typography variant="caption" fontSize={7}>
                  (Edited)
                </Typography>
              )}
            </Grid>
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
            <ShareReviewButtons shareURL={shareURL} shareTitle={shareTitle} />
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}
