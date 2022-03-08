import AuthCheck from "@components/AuthCheck";
import Metatags from "@components/Metatags";
import PersonalFav from "@components/PersonalFav";
import Rating from "@components/Rating";
import { UserContext } from "@lib/context";
import {
  defaultReview,
  Movie,
  Review,
  reviewFromFirestore,
  reviewToFirestore,
} from "@lib/models";
import { db } from "@lib/services/firebase";
import { getMovie } from "@lib/services/tmdb";
import { shimmer, toBase64 } from "@lib/utils";
import RateReview from "@mui/icons-material/RateReview";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  collectionGroup,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

interface Params extends ParsedUrlQuery {
  movieId: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { movieId } = context.params as Params;

  const { from } = context.query;

  if (!from) {
    return {
      props: {
        movie: await getMovie(movieId, {}),
      },
    };
  }

  const reviewsSnap = await getDocs(
    query(collectionGroup(db, "reviews"), where("author", "==", from))
  );
  const reviewDoc = reviewsSnap.docs.find((doc) => doc.id === movieId);

  if (!reviewDoc) {
    return {
      props: {
        movie: await getMovie(movieId, {}),
      },
    };
  }
  const existingReview = reviewFromFirestore(reviewDoc);

  return {
    props: { movie: existingReview.movie, existingReview },
  };
};

interface Props {
  existingReview?: Review;
  movie: Movie;
}

export default function RateMovie({ movie, existingReview }: Props) {
  const { user } = useContext(UserContext);
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [review, setReview] = useState(existingReview?.review || "");
  const [personalFav, setPersonalFav] = useState(
    existingReview?.personalFav || false
  );
  const router = useRouter();

  const handleSubmit = async () => {
    if (
      rating !== existingReview?.rating ||
      review !== existingReview?.review ||
      personalFav === existingReview?.personalFav
    ) {
      const reviewRef = doc(db, `users/${user!.uid}/reviews/${movie.id}`);
      const data = defaultReview({
        movie: {
          id: movie.id,
          title: movie.title,
          poster: movie.poster,
          backdrop: movie.backdrop,
        },
        rating: rating,
        review: review,
        author: user!.username,
        id: movie.id,
        personalFav: personalFav,
      });

      if (existingReview) {
        data.createdAt = existingReview.createdAt;
        await setDoc(reviewRef, {
          ...reviewToFirestore(data),
          lastEdit: serverTimestamp(),
        });
      } else {
        await setDoc(reviewRef, {
          ...reviewToFirestore(data),
          createdAt: serverTimestamp(),
          lastEdit: serverTimestamp(),
        });
      }
    }

    toast.success("Review saved", { icon: "🌟" });
    router.push(`/${user!.username}/${movie.id}`);
  };

  return (
    <main>
      <Metatags
        title={`Rate ${movie.title} in RankIO`}
        description={`Give ${movie.title} your rank and share it with your friends.`}
        image={movie.poster}
        ogEndpoint={`/rate/${movie.id}`}
      ></Metatags>
      <Container sx={{ my: 3 }}>
        <Grid container columnSpacing={3} rowSpacing={3}>
          <Grid item xs={12} lg={3}>
            <Image
              src={movie.poster}
              alt={`${movie.title}'s poster`}
              width={250}
              height={350}
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                shimmer(250, 350)
              )}`}
            />
          </Grid>
          <Grid container item xs={12} lg={9} direction="column" rowSpacing={3}>
            <Grid item xs>
              <Typography variant="h4" textAlign="left">
                Rate{" "}
                <Box
                  fontWeight="fontWeightMedium"
                  fontStyle="italic"
                  display="inline"
                >
                  {movie.title}
                </Box>
              </Typography>
            </Grid>
            <Grid item xs container direction="row" columnSpacing={2}>
              <Grid item xs={10} sm={11}>
                <Rating
                  value={rating}
                  author={user?.username}
                  onChange={(_, value) => setRating(value as number)}
                />
              </Grid>
              <Grid item xs={2} sm={1} textAlign="center">
                <PersonalFav
                  checked={personalFav}
                  onChange={(event) => setPersonalFav(event.target.checked)}
                />
              </Grid>
            </Grid>
            <Grid item xs>
              <TextField
                autoComplete="off"
                color="secondary"
                fullWidth
                multiline
                id="review"
                label="Review"
                variant="outlined"
                value={review}
                onChange={(event) => setReview(event.target.value)}
              />
            </Grid>
            <Grid item xs textAlign="center">
              <AuthCheck>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  color="inherit"
                  startIcon={<RateReview />}
                  onClick={handleSubmit}
                >
                  {existingReview ? "Update" : "Rate"}
                </Button>
              </AuthCheck>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}
