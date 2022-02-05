import AuthCheck from "@components/AuthCheck";
import { useContext } from "react";
import { UserContext } from "@lib/context";
import Metatags from "@components/Metatags";
import { getMovie } from "@lib/services/tmdb";
import { ReviewsOutlined } from "@mui/icons-material";
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
  const { user, username } = useContext(UserContext);
  const [rating, setRating] = useState(3);
  const [review, setReview] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    const reviewDoc = await getReview(user.uid, movie.id);
    if (reviewDoc.exists()) {
      toast.error("You have already rated this movie", {
        icon: "⚔️",
      });
      // TODO: route to existing review
      return;
    }
    await saveReview(
      {
        review: review,
        rating: rating,
      },
      user.uid,
      movie.id
    );
    toast.success("Review saved", { icon: "🌟" });
    router.push(`/${username}`);
  };

  return (
    <main>
      <Metatags
        title={`Rate ${movie.original_title} | RankIO`}
        description={`Rate ${movie.original_title} | RankIO`}
      ></Metatags>
      <Container sx={{ mt: 3, mb: 3 }}>
        <Grid container columnSpacing={3}>
          <Grid item xs={3}>
            <Card sx={{ width: 250 }} variant="outlined">
              <CardMedia
                component="img"
                image={movie.image}
                alt={`${movie.original_title}'s poster`}
              />
            </Card>
          </Grid>
          {/* FIXME: make responsive */}
          <Grid container item xs={9} direction="column">
            <Typography variant="h4" textAlign="left">
              Rate "{movie.original_title}"
            </Typography>

            <Grid item xs>
              <Box textAlign="left" m={5}>
                <Rating
                  size="large"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                />
              </Box>
              <Box component="form" m={5} autoComplete="off">
                <TextField
                  fullWidth
                  multiline
                  id="review"
                  label="Review"
                  variant="outlined"
                  value={review}
                  onChange={(value) => setReview(value.currentTarget.value)}
                />
              </Box>
              <Box textAlign="right">
                <AuthCheck>
                  <Button
                    variant="outlined"
                    size="large"
                    color="inherit"
                    startIcon={<ReviewsOutlined />}
                    onClick={handleSubmit}
                  >
                    Rate
                  </Button>
                </AuthCheck>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}
