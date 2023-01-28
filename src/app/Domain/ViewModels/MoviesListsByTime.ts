import { Movie } from "../Models/Movie";

export class MoviesListsByTime {
  week: Movie[] = [];
  month: Movie[] = [];
  year: Movie[] = [];
  allTime: Movie[] = [];

  constructor(params?: Partial<MoviesListsByTime>) {
    if (params)
      Object.assign(this, params);
  }
}
