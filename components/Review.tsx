import RatingSlider from "@components/RatingSlider";
import { Review as IReview } from "@lib/models";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

interface Props {
  review: IReview;
  reviewPage?: boolean;
}

export default function Review({ review, reviewPage }: Props) {
  return (
    <Card variant="elevation" elevation={5}>
      <CardActionArea
        href={`/${review.author}/${review.id}`}
        disabled={reviewPage}
      >
        <CardContent>
          <Grid container direction="row" columnSpacing={2} rowSpacing={2}>
            <Grid item xs>
              <CardMedia component="img" image={review.movie.image} />
            </Grid>
            <Grid item xs container direction="column" rowSpacing={2}>
              <Grid item xs>
                <Typography variant="h5">{review.movie.title}</Typography>
              </Grid>
              <Grid item xs>
                <RatingSlider value={review.rating} readOnly />
              </Grid>
              <Divider />
              <Grid item xs>
                <Typography variant="body1">{review.review}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
