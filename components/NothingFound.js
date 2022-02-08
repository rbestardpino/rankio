import { Grid, Typography } from "@mui/material";

export default function NothingFound({ message }) {
  return (
    <>
      <Grid item xs textAlign="center">
        <Typography variant="body1" color="ThreeDShadow">
          {message}
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
  );
}
