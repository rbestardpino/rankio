import Metatags from "@components/Metatags";
import { Button, Typography, Container, Grid } from "@mui/material";

export default function Custom404() {
  return (
    <main>
      <Metatags
        title="Oops.. | RankIO"
        description="That page does not seem to exist..."
      ></Metatags>
      <Grid container spacing={2} direction="column" alignItems="center">
        <Grid item>
          <Typography variant="h4">
            404 - That page does not seem to exist...
          </Typography>
        </Grid>
        <Grid item>
          <iframe
            src="https://giphy.com/embed/l2JehQ2GitHGdVG9y"
            width="480"
            height="362"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </Grid>
        <Grid item>
          <Button variant="contained" href="/">
            Go home
          </Button>
        </Grid>
      </Grid>
    </main>
  );
}
