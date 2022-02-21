import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

interface Props {
  message: string;
}

export default function NothingFound({ message }: Props) {
  return (
    <>
      <Grid item xs textAlign="center">
        <Typography variant="body1" color="ThreeDShadow">
          {message}
        </Typography>
      </Grid>
      <Grid item xs textAlign="center">
        <iframe
          src="https://giphy.com/embed/g01ZnwAUvutuK8GIQn"
          width="200"
          height="200"
          frameBorder="0"
        ></iframe>
      </Grid>
    </>
  );
}
