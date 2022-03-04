import AuthCheck from "@components/AuthCheck";
import NothingFound from "@components/NothingFound";
import Review from "@components/Review";
import { Review as IReview } from "@lib/models";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";

interface Props {
  reviews: IReview[];
}

export default function ReviewsList({ reviews }: Props) {
  const [filteredReviews, setFilteredReviews] = useState<IReview[]>(reviews);

  useEffect(() => {
    setFilteredReviews(reviews);
  }, [reviews]);

  const handleSearch = (e: any) => {
    e.preventDefault();
    setFilteredReviews(
      reviews.filter((rev) =>
        rev.movie.title.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  return (
    <AuthCheck>
      <Grid container direction="column" rowSpacing={1}>
        <Grid item xs>
          <Autocomplete
            disablePortal
            freeSolo
            clearOnEscape
            disableClearable
            options={reviews.map((rev) => rev.movie.title)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                fullWidth
                color="secondary"
                label="Search review"
                onChange={handleSearch}
                onSelect={handleSearch}
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                }}
              />
            )}
          />
        </Grid>

        {filteredReviews.length ? (
          filteredReviews.map((rev) => (
            <Grid item xs mx={1} key={rev.id}>
              <Review review={rev}></Review>
            </Grid>
          ))
        ) : (
          <NothingFound message="There's nothing to show here 😢" />
        )}
      </Grid>
    </AuthCheck>
  );
}
