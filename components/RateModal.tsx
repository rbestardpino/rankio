import AuthCheck from "@components/AuthCheck";
import PersonalFav from "@components/PersonalFav";
import Rating from "@components/Rating";
import {
  defaultReview,
  Movie,
  Review,
  reviewFromFirestore,
  reviewToFirestore,
} from "@lib/models";
import { db } from "@lib/services/firebase";
import { shimmer, toBase64 } from "@lib/utils";
import RateReview from "@mui/icons-material/RateReview";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { TransitionProps } from "@mui/material/transitions";
import Zoom from "@mui/material/Zoom";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import { useUserData } from "providers/UserProvider";
import { forwardRef, ReactElement, Ref, useEffect, useState } from "react";
import toast from "react-hot-toast";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref: Ref<unknown>
) {
  return <Zoom ref={ref} {...props} />;
});

interface Props {
  movie: Movie;
  open: boolean;
  handleClose: (
    event: React.SyntheticEvent<unknown>,
    reason?: string | undefined
  ) => void;
}

export default function RateModal({ movie, open, handleClose }: Props) {
  const { user } = useUserData();
  const [rating, setRating] = useState(4);
  const [review, setReview] = useState("");
  const [personalFav, setPersonalFav] = useState(false);
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, `users/${user.uid}/reviews/${movie.id}`)).then((doc) => {
      if (!doc.exists()) return;
      const existingRev = reviewFromFirestore(doc);
      setRating(existingRev.rating);
      setReview(existingRev.review);
      setPersonalFav(existingRev.personalFav);
      setExistingReview(existingRev);
    });
  }, [user, movie.id]);

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
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      TransitionComponent={Transition}
    >
      <DialogTitle>
        Rate{" "}
        <Box fontWeight="fontWeightMedium" fontStyle="italic" display="inline">
          {movie.title}
        </Box>
      </DialogTitle>
      <DialogContent>
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
          <Grid
            container
            item
            xs={12}
            lg={9}
            direction="column"
            rowSpacing={3}
            justifyContent="space-evenly"
            alignItems="stretch"
            mt={1}
          >
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
                  checked={false}
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
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={handleClose}>
          Cancel
        </Button>
        <AuthCheck>
          <Button
            variant="outlined"
            size="large"
            color="inherit"
            startIcon={<RateReview />}
            onClick={(e) => {
              handleClose(e);
              handleSubmit();
            }}
          >
            Save Review
          </Button>
        </AuthCheck>
      </DialogActions>
    </Dialog>
  );
}
