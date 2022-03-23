import Metatags from "@components/Metatags";
import MovieCard from "@components/MovieCard";
import NothingFound from "@components/NothingFound";
import { Movie } from "@lib/models";
import { getPopularMovies, searchMovies } from "@lib/services/tmdb";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ChangeEventHandler, useState } from "react";

export async function getStaticProps() {
  const movies = await getPopularMovies({});
  return {
    props: { movies },
    revalidate: 86400,
  };
}

interface Props {
  movies: Movie[];
}

export default function Rate({ movies }: Props) {
  const [filteredMovies, setFilteredMovies] = useState(movies);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = async (e) => {
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
        title="Rate movies in RankIO"
        description={`Search for a movie and give your rank. Rate ${movies
          .map((mov) => mov.title)
          .join(", ")}.`}
        image={movies[0].poster}
        ogEndpoint="/rate"
      />
      <Container sx={{ my: 3 }}>
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
                color="secondary"
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
