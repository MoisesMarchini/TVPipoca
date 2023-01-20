import { Component, OnInit } from '@angular/core';
import { ListResponse } from '../Domain/Models/ListResponse';
import { Movie } from '../Domain/Models/Movie';
import { Genre } from '../Domain/Models/Genre';
import { MoviesService } from '../Services/Movies.service';
import { ListGenres } from '../Domain/Models/ListGenres';

@Component({
  selector: 'app-Index',
  templateUrl: './Index.component.html',
  styleUrls: ['./Index.component.scss']
})
export class IndexComponent implements OnInit {

  public imgUrl = 'https://image.tmdb.org/t/p/w440_and_h660_face/';
  public genreList: Genre[] = [];
  public movieList: Movie[] = [];
  public responseList?: ListResponse;
  public selectedGenre?: Genre;
  public queryString = "";


  public lastPage = () => {

    if (this.responseList != null)
      return Math.min(500, this.responseList?.total_pages);

    return 1;
  };
  public firstPage = () => {
    return 1;
  };
  public currentPage = () => {

    if (this.responseList != null)
      return this.responseList?.page;

    return 1;
  };
  public nextPage = () => {

    if (this.responseList != null)
      return this.responseList?.page + 1;

    return 1;
  };
  public prevPage = () => {

    if (this.responseList != null)
      return this.responseList?.page - 1;

    return 1;
  };

  constructor(private moviesService: MoviesService) { }

  public ngOnInit(): void {
    this.getMovies();
  }

  public clearFilters(): void{
    this.selectedGenre = undefined;
    this.queryString = "";
    this.getMovies();
  }

  public getMovies(page?: number, genre_id?: number): void {

    if (this.queryString != "") {
      this.getSearchResults(this.queryString, page);
      return;
    }
    if (genre_id == null && this.selectedGenre != null)
      genre_id = this.selectedGenre.id;

    this.getGenreList();
    this.moviesService.getAllMovies(page, genre_id).subscribe(
      (listResp: ListResponse) => {
        this.movieList = listResp.results;
        this.responseList = listResp;
        this.selectedGenre = undefined;
        console.log(this.movieList, "movielist")
        if (genre_id != null)
          this.selectedGenre = this.genreList.find(p => p.id == genre_id);
      },
      error => console.log(error)
    );
  }

  public getSearchResults(queryString: string, page?: number): void {
    this.getGenreList();
    this.moviesService.searchForMovies(queryString, page).subscribe(
      (listResp: ListResponse) => {
        this.movieList = listResp.results;
        this.responseList = listResp;
        this.selectedGenre = undefined;
        console.log(this.movieList, "movielist")
      },
      error => console.log(error)
    );
  }

  public getGenreList(): void{
    this.moviesService.getGenreList().subscribe(
      (genreResp: ListGenres) => {
        this.genreList = genreResp.genres;
        console.log(this.genreList, "genre list")
    },
      error => console.log(error)
    );
  }

  public getPagination(): number[] {
    let pagination:number[] = [];
    let totalPagination = 9;
    let firstIndex = 1;

    if (this.currentPage() > Math.floor(totalPagination/2))
      firstIndex = this.currentPage() - Math.floor(totalPagination / 2);

      if (this.lastPage() - this.currentPage() < Math.floor(totalPagination/2))
        firstIndex = this.lastPage() - totalPagination +1;


    for (let i = 0; i < totalPagination; i++) {
      let element = i + firstIndex;
      pagination.push(element);
    }

    return pagination;
  }
}
