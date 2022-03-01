import AuthCheck from "@components/AuthCheck";
import Metatags from "@components/Metatags";
import RatingSlider from "@components/RatingSlider";
import { UserContext } from "@lib/context";
import { defaultReview, Movie, reviewToFirestore } from "@lib/models";
import { db } from "@lib/services/firebase";
import { getMovie } from "@lib/services/tmdb";
import RateReview from "@mui/icons-material/RateReview";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useContext, useState } from "react";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import toast from "react-hot-toast";

interface Params extends ParsedUrlQuery {
  movieId: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { movieId } = context.params as Params;
  return {
    props: { movie: await getMovie(movieId, {}) },
  };
};

interface Props {
  movie: Movie;
}

export default function RateMovie({ movie }: Props) {
  const { user } = useContext(UserContext);
  const [rev] = useDocumentDataOnce(
    doc(db, `users/${user?.uid}/reviews/${movie.id}`)
  );
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
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
    });

    await setDoc(reviewRef, {
      ...reviewToFirestore(data),
      lastEdit: serverTimestamp(),
    });

    toast.success("Review saved", { icon: "🌟" });
    router.push(`/${user!.username}/${movie.id}`);
  };

  return (
    <main>
      <Metatags
        title={`Rate ${movie.title} | RankIO`}
        description={`Rate ${movie.title} | RankIO`}
        image={movie.poster}
      ></Metatags>
      <Container sx={{ my: 3 }}>
        <Grid container columnSpacing={3} rowSpacing={3}>
          <Grid item xs={12} lg={3}>
            <Card sx={{ width: 250 }} variant="outlined">
              <CardMedia
                component="img"
                image={movie.poster}
                alt={`${movie.title}'s poster`}
              />
            </Card>
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
            <Grid item xs>
              <RatingSlider
                value={rev?.rating || rating}
                onChange={(_, value) => setRating(value as number)}
              />
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
                value={rev?.review || review}
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
                  {rev ? "Update" : "Rate"}
                </Button>
              </AuthCheck>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}
