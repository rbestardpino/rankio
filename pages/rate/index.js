import Metatags from "@components/Metatags";
import MovieCard from "@components/MovieCard";
import NothingFound from "@components/NothingFound";
import { getPopularMovies, searchMovies } from "@lib/services/tmdb";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";

export async function getServerSideProps() {
  const movies = await getPopularMovies({});
  return {
    props: { movies: movies }, // will be passed to the page component as props
  };
}

export default function Rate({ movies }) {
  const [filteredMovies, setFilteredMovies] = useState(movies);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    e.preventDefault();
    const _input = e.target.value;
    if (!_input) setFilteredMovies(movies);
    else {
      setLoading(true);
      setFilteredMovies(await searchMovies({ query: _input }));
      setLoading(false);
    }
    setInput(_input);
  };

  return (
    <main>
      <Metatags
        title="Rate a movie | RankIO"
        description="Rate a movie | RankIO"
      />
      <Container sx={{ mt: 3, mb: 3 }}>
        <Grid container direction="column" rowSpacing={3}>
          <Grid item xs>
            <Typography variant="h3" mb={3}>
              Pick a movie to rate
            </Typography>
          </Grid>
          <Grid item xs>
            <Box component="form" autoComplete="off">
              <TextField
                variant="outlined"
                fullWidth
                label="Search movie"
                helperText={"Powered by TMDB ®️"}
                onChange={handleChange}
                color="white"
              />
            </Box>
          </Grid>
          <Grid item xs>
            <Typography variant="subtitle2">
              {loading
                ? "Searching..."
                : input === ""
                ? "Popular movies"
                : `Results for "${input}"`}
            </Typography>
          </Grid>
          <Grid item xs container spacing={3}>
            {filteredMovies.length ? (
              filteredMovies.map((mov) => (
                <Grid
                  item
                  xs
                  container
                  alignContent="start"
                  justifyContent="center"
                  key={mov.id}
                >
                  <MovieCard movie={mov} />
                </Grid>
              ))
            ) : (
              <NothingFound message="We could not find the movie you're looking for 😢" />
            )}
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}
