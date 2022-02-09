import notfoundposter from "../../public/posternotfound.png";

const CONFIG = {
  api_key: "fc38338f58588b810badb2febb318cf1",
  base_uri: "http://api.themoviedb.org/3/",
  images_uri: "http://image.tmdb.org/t/p/w500",
  timeout: 5000,
  language: "en-US",
  poster_not_found: notfoundposter.src,
};

function generateQuery(options) {
  var myOptions, query, option;

  myOptions = options || {};
  query = "?api_key=" + CONFIG.api_key + "&language=" + CONFIG.language;

  if (Object.keys(myOptions).length > 0) {
    for (option in myOptions) {
      if (
        myOptions.hasOwnProperty(option) &&
        option !== "id" &&
        option !== "body"
      ) {
        query = query + "&" + option + "=" + myOptions[option];
      }
    }
  }
  return query;
}

async function getData(slug, options) {
  const url = CONFIG.base_uri + slug + generateQuery(options);
  return await (await fetch(url)).json();
}

function addImage(movie) {
  movie.image = movie.poster_path
    ? CONFIG.images_uri + movie.poster_path
    : CONFIG.poster_not_found;
  return movie;
}

export async function getPopularMovies(options) {
  const data = await getData("movie/popular", options);
  const movies = data.results;
  movies.forEach(addImage);
  return movies;
}

export async function getMovie(id, options) {
  let movie = await getData(`movie/${id}`, options);

  movie = addImage(movie);

  return movie;
}

export async function searchMovies(options) {
  const data = await getData("search/movie", options);
  const movies = data.results;
  movies.forEach(addImage);
  return movies;
}

export async function getTopMovies(options) {
  const data = await getData("movie/top_rated", options);
  const movies = data.results;
  movies.forEach(addImage);
  return movies;
}
