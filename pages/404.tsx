import Metatags from "@components/Metatags";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export default function Custom404() {
  return (
    <main>
      <Metatags
        title="Oops.. | RankIO"
        description="That page does not seem to exist..."
      ></Metatags>
      <Container sx={{ my: 5 }}>
        <Grid container rowSpacing={2} direction="column" alignItems="center">
          <Grid item xs>
            <Typography variant="h4">
              404 - That page does not seem to exist...
            </Typography>
          </Grid>
          <Grid item xs>
            <iframe
              src="https://giphy.com/embed/g01ZnwAUvutuK8GIQn"
              width="480"
              height="362"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </Grid>
          <Grid item xs>
            <Button variant="outlined" color="inherit" href="/home">
              Go home
            </Button>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}
