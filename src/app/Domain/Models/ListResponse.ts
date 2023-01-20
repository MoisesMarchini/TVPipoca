import { Movie } from "./Movie";

export interface ListResponse {

  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
