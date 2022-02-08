import { UserContext } from "@lib/context";
import {
  Container,
  Grid,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import { useContext, useState } from "react";
import AuthCheck from "@components/AuthCheck";
import Review from "@components/Review";
import NothingFound from "./NothingFound";

export default function ReviewsList() {
  const { reviews } = useContext(UserContext);
  const [filteredReviews, setFilteredReviews] = useState(reviews);

  const handleSearch = (e) => {
    setFilteredReviews(
      reviews.filter((rev) =>
        rev.title.toLowerCase().includes(e.target.value.toLowerCase())
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
            options={reviews.map((rev) => rev.title)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                fullWidth
                autoFocus
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
              <Review review={rev} noWrap></Review>
            </Grid>
          ))
        ) : (
          <NothingFound message="There's nothing to show here 😢" />
        )}
      </Grid>
    </AuthCheck>
  );
}
