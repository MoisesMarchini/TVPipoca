import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Genre } from '../Domain/Models/Genre';
import { Movie } from '../Domain/Models/Movie';
import { Observable } from 'rxjs';
import { ListResponse } from '../Domain/Models/ListResponse';
import { ListGenres } from '../Domain/Models/ListGenres';
import { Filters } from '../Domain/Filters';
import { SortBy } from '../Domain/SortBy.enum';
import { ListKeywords } from '../Domain/Models/ListKeywords';
import { WatchProvider } from '../Domain/Models/WatchProvider';
import { WatchProviderSearch } from '../Domain/Models/WatchProviderSearch';
import { CreditsResult } from '../Domain/Models/Credits/CreditsResult';

@Injectable(

)
export class MoviesService {

  baseUrl = 'https://api.themoviedb.org/3/';
  apiKey = '012c842bef3de130f841ee794abef215';
  language = 'pt-BR';

  providersListUrl =
    `${this.baseUrl}movie/{movie_id}/watch/providers?api_key=${this.apiKey}`

  trendingListUrl =
    `${this.baseUrl}trending/movie/week?api_key=${this.apiKey}&language=pt-BR`

  creditsUrl =
    `${this.baseUrl}movie/{movie_id}/credits?api_key=${this.apiKey}&language=pt-BR`

  genreListUrl =
    `${this.baseUrl}genre/movie/list?api_key=${this.apiKey}&language=${this.language}`;

  defaultMovieListUrl =
    `${this.baseUrl}discover/movie?api_key=${this.apiKey}&language=${this.language}&include_adult=false`;

  searchKeywordsIds =
    `${this.baseUrl}search/keyword?api_key=${this.apiKey}&query=`;

  queryGenreUrl =
    "&with_genres=";

  queryKeywordsUrl =
    "&with_keywords=";

  queryPrimaryReleaseDateUrl =
    "&release_date.gte=";

  queryLastReleaseDateUrl =
    "&release_date.lte=";

  queryPrimaryVoteAverageUrl =
    "&vote_average.gte=";

  queryLastVoteAverageUrl =
    "&vote_average.lte=";

  queryPrimaryVoteCount =
    "&vote_count.gte=";

  queryLastVoteCount =
    "&vote_count.lte=";

  queryPageUrl =
    "&page=";

  sortedBy =
    "&sort_by=";

  constructor(private http: HttpClient) { }

  getGenreList(): Observable<ListGenres> {
    return this.http.get<ListGenres>(this.genreListUrl);
  }

  getProvidersList(movieId: number): Observable<WatchProviderSearch>  {
    return this.http.get<WatchProviderSearch>(this.providersListUrl.replace("{movie_id}", movieId.toString()));
  }

  getCreditsList(movieId: number): Observable<CreditsResult>  {
    return this.http.get<CreditsResult>(this.creditsUrl.replace("{movie_id}", movieId.toString()));
  }


  getAllMovies(filters: Filters, page: number = 1): Observable<ListResponse>{

    let genreIds = filters.genres.map((p, i) => {
      return p.id.toString();
    });


    if (filters.lastReleaseDate == "")
      filters.lastReleaseDate = Date.now().toString();

    page = Math.max(1, page);
    let searchQuery = this.defaultMovieListUrl;

    if (genreIds.length != 0)
      searchQuery += this.queryGenreUrl + genreIds;

    if(filters.keyWords != "")
      searchQuery += this.queryKeywordsUrl + filters.keyWords;

    if(filters.primaryReleaseDate != "")
      searchQuery += this.queryPrimaryReleaseDateUrl + filters.primaryReleaseDate;

    searchQuery += this.queryLastReleaseDateUrl + filters.lastReleaseDate;

    if(filters.primaryVoteAverage != filters.lastVoteAverage){
      searchQuery += this.queryPrimaryVoteAverageUrl + filters.primaryVoteAverage;
      searchQuery += this.queryLastVoteAverageUrl + filters.lastVoteAverage;
    }

    if(filters.voteCountMin > 0)
      searchQuery += this.queryPrimaryVoteCount + filters.voteCountMin;



    searchQuery += this.sortedBy + this.convertSortToQuery(filters.sortBy);
    searchQuery += this.queryPageUrl + page;

    return this.http.get<ListResponse>(searchQuery);

  }

  getTrendingMovies(): Observable<ListResponse> {
    return this.http.get<ListResponse>(this.trendingListUrl);
  }

  getKeywordId(keyword: string): Observable<ListKeywords>{
    return this.http.get<ListKeywords>(this.searchKeywordsIds + keyword);
  }

  convertSortToQuery(sortBy: SortBy): string{
    switch (sortBy) {
      case SortBy.popularityMost:
        return "popularity.desc";
      case SortBy.popularityLess:
        return "popularity.asc";

      case SortBy.releaseDateNew:
        return "release_date.desc";
      case SortBy.releaseDateOld:
        return "release_date.asc";

      case SortBy.reviewMost:
        return "vote_average.desc";
      case SortBy.reviewWorst:
        return "vote_average.asc";

      case SortBy.titleAZ:
        return "original_title.asc";
      case SortBy.titleZA:
        return "original_title.desc";

      default:
        break;
    }


    return "";
  }

}
