const API_KEY = "d21ed3db2d1bb494c58f5fd8f86d64ee";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  original_language: string;
  release_date: string;
  genre_ids: number[];
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMovies(type: string) {
  return fetch(
    `${BASE_PATH}/movie/${type}?api_key=${API_KEY}&language=ko-kr`
  ).then((response) => response.json());
}

export interface IGetSearchMoviesResult {
  results: IMovie[] | ITvShow[];
}

export function getSearchMovies(keyword: string, type: string) {
  return fetch(
    `${BASE_PATH}/search/${type}?api_key=${API_KEY}&query=${keyword}&language=ko-kr`
  ).then((response) => response.json());
}

export interface IGenres {
  id: number;
  name: string;
}

export interface IGetGenresResult {
  genres: IGenres[];
}

export function getGenres(type: string) {
  return fetch(`${BASE_PATH}/genre/${type}/list?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export interface ITvShow {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  original_language: string;
  genre_ids: number[];
}

export interface IGetTvShowsResult {
  page: number;
  results: ITvShow[];
  total_pages: number;
  total_results: number;
}

export function getTvShows(time: string) {
  return fetch(
    `${BASE_PATH}/trending/tv/${time}?api_key=${API_KEY}&language=ko-kr${
      time === "week" ? "&page=2" : ""
    }`
  ).then((response) => response.json());
}
