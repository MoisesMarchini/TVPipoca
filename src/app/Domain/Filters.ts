import { Genre } from "./Models/Genre";
import { SortBy } from "./SortBy.enum";

export class Filters {
  sortBy = SortBy.popularityMost;

  genres: Genre[] = [];

  primaryReleaseDate: string = "";
  lastReleaseDate: string = "";

  primaryVoteAverage = 0;
  lastVoteAverage = 0;

  primaryDuration = 0;
  lastDuration = 600;

  voteCountMin = 0;
  voteCountMax = 0;

  keyWords: string = "";
}
