import { UserContext } from "@lib/context";
import { Container, Grid, Paper, Typography } from "@mui/material";
import { useContext } from "react";
import AuthCheck from "@components/AuthCheck";
import Review from "@components/Review";

export default function ReviewsList() {
  const { reviews } = useContext(UserContext);

  return (
    <AuthCheck>
      <Grid container direction="column" rowSpacing={2}>
        {/* TODO: search bar */}
        {reviews ? (
          reviews.map((rev) => (
            <>
              <Grid item xs mx={1}>
                <Review review={rev} key={rev.id}></Review>
              </Grid>
            </>
          ))
        ) : (
          <>
            <Grid item xs textAlign="center">
              <Typography variant="body1" color="ThreeDShadow">
                There's nothing to show here 😢
              </Typography>
            </Grid>
            <Grid item xs textAlign="center">
              <iframe
                src="https://giphy.com/embed/26hkhPJ5hmdD87HYA"
                width="200"
                height="200"
                frameBorder="0"
              ></iframe>
            </Grid>
          </>
        )}
      </Grid>
    </AuthCheck>
  );
}
