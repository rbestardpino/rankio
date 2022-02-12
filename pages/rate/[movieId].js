import AuthCheck from "@components/AuthCheck";
import Metatags from "@components/Metatags";
import { UserContext } from "@lib/context";
import { saveReview } from "@lib/services/db";
import { getMovie } from "@lib/services/tmdb";
import { RateReview } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  Grid,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

export async function getServerSideProps({ query: urlQuery }) {
  const { movieId } = urlQuery;
  const movie = await getMovie(movieId);
  return {
    props: { movie: movie },
  };
}

export default function RateMovie({ movie }) {
  const { user, reviews, username } = useContext(UserContext);
  // FIXME: why existing review doesnt work!!!
  const existingReview = reviews.find((rev) => rev.id === movie.id);
  const [rating, setRating] = useState(
    existingReview ? existingReview.rating : 5
  );
  const [review, setReview] = useState(
    existingReview ? existingReview.review : ""
  );
  const router = useRouter();

  movie.original_title =
    movie.language === "en" ? movie.original_title : movie.title;

  const handleSubmit = async () => {
    await saveReview(
      {
        review: review,
        rating: rating,
        image: movie.image,
        title: movie.original_title,
        author: username,
      },
      user.uid,
      movie.id
    );
    toast.success("Review saved", { icon: "🌟" });
    router.push(`/${username}/${movie.id}`);
  };

  return (
    <main>
      <Metatags
        title={`Rate ${movie.original_title} | RankIO`}
        description={`Rate ${movie.original_title} | RankIO`}
        image={movie.image}
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
                Rate{" "}
                <Box
                  fontWeight="fontWeightMedium"
                  fontStyle="italic"
                  display="inline"
                >
                  {movie.original_title}
                </Box>
              </Typography>
            </Grid>
            <Grid item xs>
              {/* TODO: change to slider */}
              <Rating
                size="large"
                max={10}
                value={rating}
                onChange={(event) => {
                  setRating(event.target.value);
                }}
              />
              {rating !== null && <Box>{`${rating}/10`}</Box>}
            </Grid>
            <Grid item xs>
              <TextField
                autoComplete="off"
                fullWidth
                multiline
                autoFocus
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
