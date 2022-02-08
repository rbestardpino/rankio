import {
  Card,
  Grid,
  CardMedia,
  Typography,
  Rating,
  CardActionArea,
  Paper,
  Divider,
} from "@mui/material";

export default function Review({ review, noWrap, reviewPage }) {
  return (
    <Card variant="elevation" elevation={5}>
      <CardActionArea
        href={`/${review.creator}/${review.id}`}
        disabled={reviewPage}
      >
        <Grid container direction="row" columnSpacing={2}>
          <Grid item xs height={reviewPage ? 270 : 170}>
            <Card>
              <CardMedia
                height={reviewPage ? 270 : 170}
                component="img"
                image={review.image}
                alt={`${review.title}'s poster`}
              />
            </Card>
          </Grid>
          <Grid
            item
            container
            xs={10}
            mt={0.5}
            direction="column"
            rowSpacing={1}
            width={0}
          >
            <Grid item xs container direction="row">
              <Grid item xs>
                <Typography variant="h6" noWrap={noWrap}>
                  {review.title}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs>
              <Rating value={review.rating} max={10} readOnly size="large" />
            </Grid>
            <Grid item xs container>
              <Typography variant="body1" noWrap={noWrap}>
                {review.review}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </CardActionArea>
    </Card>
  );
}
