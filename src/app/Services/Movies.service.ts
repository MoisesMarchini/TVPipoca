import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Genre } from '../Domain/Models/Genre';
import { Movie } from '../Domain/Models/Movie';
import { Observable } from 'rxjs';
import { ListResponse } from '../Domain/Models/ListResponse';
import { ListGenres } from '../Domain/Models/ListGenres';

@Injectable(

)
export class MoviesService {

  baseUrl = 'https://api.themoviedb.org/3/';
  apiKey = '012c842bef3de130f841ee794abef215';
  language = 'pt-BR';

  genreListUrl =
    `${this.baseUrl}genre/movie/list?api_key=${this.apiKey}&language=${this.language}`;

  defaultMovieListUrl =
    `${this.baseUrl}discover/movie?api_key=${this.apiKey}&language=${this.language}`;

  searchMovieUrl =
    `${this.baseUrl}search/movie?api_key=${this.apiKey}&language=${this.language}&query`;

  queryGenreUrl =
    "&with_genres=";

  queryPageUrl =
    "&page=";

  sortedByPopularity =
    "&sort_by=popularity.desc";

  constructor(private http: HttpClient) { }

  getGenreList(): Observable<ListGenres> {
    return this.http.get<ListGenres>(this.genreListUrl);
  }


  getAllMovies(page: number = 1, genre_id?: number): Observable<ListResponse>{

    page = Math.max(1, page);
    let searchQuery = this.defaultMovieListUrl;

    if (genre_id != null)
      searchQuery += this.queryGenreUrl + genre_id;

    searchQuery += this.sortedByPopularity;
    searchQuery += this.queryPageUrl + page;

    return this.http.get<ListResponse>(searchQuery);

  }

  searchForMovies(queryString: string, page: number = 1): Observable<ListResponse>{

    page = Math.max(1, page);
    let searchQuery = this.searchMovieUrl;

    queryString = queryString.replace(' ', '+');

    searchQuery += queryString;

    searchQuery += this.sortedByPopularity;
    searchQuery += this.queryPageUrl + page;

    return this.http.get<ListResponse>(searchQuery);

  }

}
