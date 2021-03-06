import { Review as IReview } from "@lib/models";
import { shimmer, toBase64 } from "@lib/utils";
import CardActionArea from "@mui/material/CardActionArea";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Image from "next/image";
import PersonalFav from "./PersonalFav";
import Rating from "./Rating";

interface Props {
  review: IReview;
}

export default function Review({ review }: Props) {
  const max420 = useMediaQuery("(max-width:420px)");
  const max700 = useMediaQuery("(max-width:700px)");
  function getHeight(): number {
    if (max420) return 120;
    if (max700) return 170;
    return 220;
  }

  const ratio = 500 / 750;
  const height = getHeight();
  const width = height * ratio;

  return (
    <CardActionArea href={`/${review.author}/${review.id}`}>
      <Paper variant="elevation" elevation={5}>
        <Grid container direction="row" maxHeight={height}>
          <Grid item maxHeight={height} maxWidth={width}>
            <Image
              src={review.movie.poster}
              alt={`${review.movie.title}'s poster`}
              height={height}
              width={width}
              priority
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                shimmer(width, height)
              )}`}
            />
          </Grid>
          <Grid
            item
            xs
            container
            mx={1}
            my={0.5}
            direction="column"
            rowSpacing={1}
            width={0}
            maxHeight={height}
          >
            <Grid item xs container direction="row">
              <Grid item xs>
                <Typography variant={max420 ? "subtitle2" : "h6"} noWrap>
                  {review.movie.title}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs container direction="row" columnSpacing={0}>
              <Grid item xs={10} sm={11}>
                <Rating value={review.rating} readOnly author={review.author} />
              </Grid>
              <Grid item xs={2} sm={1}>
                <PersonalFav checked={review.personalFav} readOnly />
              </Grid>
            </Grid>
            {!max420 && (
              <Grid item xs container direction="row">
                <Grid item xs>
                  <Typography variant="body1" fontFamily="Average" noWrap>
                    {review.review}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Paper>
    </CardActionArea>
  );
}
