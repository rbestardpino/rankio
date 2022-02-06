import { RateReview } from "@mui/icons-material";
import {
  Card,
  Container,
  Grid,
  CardMedia,
  Typography,
  Rating,
  Box,
  IconButton,
  CardActionArea,
} from "@mui/material";
import Link from "next/link";

export default function Review({ review, noWrap, noLink }) {
  return (
    <Card variant="elevation" elevation={5}>
      <CardActionArea
        href={`/${review.creator}/${review.id}`}
        disabled={noLink}
      >
        <Grid
          container
          direction="row"
          columnSpacing={2}
          height={noLink ? 270 : 170}
        >
          <Grid item xs>
            <Card>
              <CardMedia
                height={noLink ? 270 : 170}
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
            my={0.5}
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
            <Grid item xs container direction="row">
              <Typography variant="body" noWrap={noWrap}>
                {review.review}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </CardActionArea>
    </Card>
  );
}
