import { Movie, movieFromJSON } from "@lib/models";
import notfoundposter from "@public/posternotfound.png";

const CONFIG = {
  api_key: "fc38338f58588b810badb2febb318cf1",
  base_uri: "https://api.themoviedb.org/3/",
  images_uri: "https://image.tmdb.org/t/p/w500",
  timeout: 5000,
  language: "en-US",
  poster_not_found: notfoundposter.src,
};

function generateQuery(options: any): string {
  let myOptions, query: string, option;

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

async function getData(slug: string, options: any): Promise<any> {
  const url: string = CONFIG.base_uri + slug + generateQuery(options);
  return await (await fetch(url)).json();
}

function addImage(movie: any): any {
  movie.image = movie.poster_path
    ? CONFIG.images_uri + movie.poster_path
    : CONFIG.poster_not_found;
  return movie;
}

export async function getPopularMovies(options: any): Promise<Movie[]> {
  const data = await getData("movie/popular", options);
  const movies: any[] = data.results;
  movies.forEach(addImage);
  return movies.map(movieFromJSON);
}

export async function getMovie(id: string, options: any): Promise<Movie> {
  let movie: any = await getData(`movie/${id}`, options);

  movie = addImage(movie);

  return movieFromJSON(movie);
}

export async function searchMovies(options: any): Promise<Movie[]> {
  const data = await getData("search/movie", options);
  const movies: any[] = data.results;
  movies.forEach(addImage);
  return movies.map(movieFromJSON);
}

export async function getTopMovies(options: any): Promise<Movie[]> {
  const data = await getData("movie/top_rated", options);
  const movies: any[] = data.results;
  movies.forEach(addImage);
  return movies.map(movieFromJSON);
}
