import AuthCheck from "@components/AuthCheck";
import { useContext } from "react";
import { UserContext } from "@lib/context";
import Metatags from "@components/Metatags";
import { getMovie } from "@lib/services/tmdb";
import { RateReview } from "@mui/icons-material";
import {
  Container,
  Card,
  CardMedia,
  Typography,
  Grid,
  Box,
  TextField,
  Rating,
  Button,
  Slider,
} from "@mui/material";
import { useState } from "react";
import { saveReview, getReview } from "@lib/services/db";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export async function getServerSideProps({ query: urlQuery }) {
  const { movieId } = urlQuery;
  const movie = await getMovie(movieId);
  return {
    props: { movie: movie },
  };
}

export default function RateMovie({ movie }) {
  const { user, reviews, username } = useContext(UserContext);
  const existingReview = reviews.find((rev) => rev.id == movie.id);
  // FIXME: why existing review doesnt work!!!
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [review, setReview] = useState(existingReview?.review || "");
  const router = useRouter();

  const handleSubmit = async () => {
    await saveReview(
      {
        review: review,
        rating: rating,
        image: movie.image,
        title: movie.original_title,
        creator: username,
      },
      user.uid,
      movie.id
    );
    toast.success("Review saved", { icon: "🌟" });
    router.push("/");
  };

  return (
    <main>
      <Metatags
        title={`Rate ${movie.original_title} | RankIO`}
        description={`Rate ${movie.original_title} | RankIO`}
      ></Metatags>
      <Container sx={{ mt: 3, mb: 3 }}>
        <Grid container columnSpacing={3} rowSpacing={3}>
          <Grid item xs={12} lg={3}>
            <Card sx={{ width: 250 }} variant="outlined">
              <CardMedia
                component="img"
                image={movie.image}
                alt={`${movie.original_title}'s poster`}
              />
            </Card>
          </Grid>
          <Grid container item xs={12} lg={9} direction="column" rowSpacing={3}>
            <Grid item xs>
              <Typography variant="h4" textAlign="left">
                Rate "{movie.original_title}"
              </Typography>
            </Grid>
            <Grid item xs>
              {/* TODO: change to slider */}
              <Rating
                size="large"
                max={10}
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
              />
              {rating !== null && <Box>{`${rating}/10`}</Box>}
            </Grid>
            <Grid item xs>
              <TextField
                autoComplete="off"
                fullWidth
                multiline
                id="review"
                label="Review"
                variant="outlined"
                value={review}
                onChange={(value) => setReview(value.currentTarget.value)}
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
