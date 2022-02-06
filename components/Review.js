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
} from "@mui/material";
import Link from "next/link";

export default function Review({ review }) {
  return (
    <Link href={`/rate/${review.id}`}>
      <Card variant="elevation" elevation={2}>
        <Grid container direction="row" columnSpacing={2} height={170}>
          <Grid item xs>
            <Card>
              <CardMedia
                height={170}
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
                <Typography variant="h6">{review.title}</Typography>
              </Grid>
              <Grid item xs textAlign="right"></Grid>
            </Grid>
            <Grid item xs>
              <Rating value={review.rating} max={10} readOnly size="large" />
            </Grid>
            <Grid item xs>
              {/* FIXME: Text overflow ellipsis */}
              <Typography variant="body" noWrap textOverflow="ellipsis">
                {review.review}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Link>
  );
}
