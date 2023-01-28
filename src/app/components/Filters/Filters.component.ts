import { Component, Input, OnInit } from '@angular/core';
import { Filters } from 'src/app/Domain/Filters';
import { Genre } from 'src/app/Domain/Models/Genre';
import { ListGenres } from 'src/app/Domain/Models/ListGenres';
import { ListKeywords } from 'src/app/Domain/Models/ListKeywords';
import { SortBy } from 'src/app/Domain/SortBy.enum';
import { MoviesService } from 'src/app/Services/Movies.service';
import { MovieListComponent } from '../MovieList/MovieList.component';

@Component({
  selector: 'app-Filters',
  templateUrl: './Filters.component.html',
  styleUrls: ['./Filters.component.scss']
})
export class FiltersComponent implements OnInit {

  @Input("MovieListComponent") movieListComponent: MovieListComponent | undefined;

  collapseSortBy = true;
  static staticFilters: Filters = new Filters();
  static genreList: Genre[] = [];

  _filters = FiltersComponent.staticFilters;
  _genreList = FiltersComponent.genreList;
  sortByAsStringArray:string[] = [];
  sortByAsIdArray:SortBy[] = [];
  collapseGenre = true;
  collapseKeyword = true;

  constructor(private moviesService: MoviesService) {
    this.getGenreList();
    this._filters = FiltersComponent.staticFilters;
  }

  ngOnInit() {
    this.convertSortByEnumToArray();
  }


  getGenreList(): void{
    if (FiltersComponent.genreList.length > 0)
      return;
    this.moviesService.getGenreList().subscribe(
      (genreResp: ListGenres) => {
        FiltersComponent.genreList = this._genreList = genreResp.genres;
    },
      error => console.log(error)
    );
  }

  addGenreToFilter(genre: Genre): void{

    if (this._filters.genres.includes(genre))
      this._filters.genres = this._filters.genres.filter(p => p.id != genre.id);
    else
      this._filters.genres.push(genre);
  }

  setSortBy(index: number): void{
    this._filters.sortBy = this.sortByAsIdArray[index];
  }

  isSortBy(index: number): boolean{
    return this._filters.sortBy == this.sortByAsIdArray[index];
  }

  getSortByString(index: number): string{
    return this.sortByAsStringArray[index];
  }

  getCurrentSortByString(): string{
    return this.sortByAsStringArray[this._filters.sortBy];
  }

  convertSortByEnumToArray(): void {
    let result: string[] = [];
    let resultIds: SortBy[] = [];
    for (let i = 0; i < 8; i++) {

      if(SortBy.popularityMost == i){
        resultIds.push(SortBy.popularityMost);
        result.push("Popularidade (Maior)");
      }

      if(SortBy.popularityLess == i){
        resultIds.push(SortBy.popularityLess);
        result.push("Popularidade (Menor)");
      }

      if(SortBy.releaseDateNew == i){
        resultIds.push(SortBy.releaseDateNew);
        result.push("Data de lançamento (Mais Novo)");
      }
      if(SortBy.releaseDateOld == i){
        resultIds.push(SortBy.releaseDateOld);
        result.push("Data de lançamento (Mais Antigo)");
      }

      if(SortBy.reviewMost == i){
        resultIds.push(SortBy.reviewMost);
        result.push("Avaliação média (Melhor)");
      }
      if(SortBy.reviewWorst == i){
        resultIds.push(SortBy.reviewWorst);
        result.push("Avaliação média (Pior)");
      }

      if(SortBy.titleAZ == i){
        resultIds.push(SortBy.titleAZ);
        result.push("Título (A-Z)");
      }
      if(SortBy.titleZA == i){
        resultIds.push(SortBy.titleZA);
        result.push("Título (Z-A)");
      }

    }
    this.sortByAsStringArray = result;
    this.sortByAsIdArray = resultIds;
  }

  convertKeywordsToId(keywords: string): void{
    if (keywords == "")
      return;
    let keywordsArr = keywords.split(',');
    let keywordsIds = "";

    keywordsArr.forEach(word => {
      this.moviesService.getKeywordId(word).subscribe(
        (listResp: ListKeywords) => {
          listResp.results.forEach((result, index) => {
            keywordsIds += result.id.toString();
            if (index + 1 < listResp.results.length)
              keywordsIds += '|';
          })

          this._filters.keyWords = keywordsIds == ""? "-1" : keywordsIds;
        },
        error => console.log(error)
      );
    });

  }

  setVoteCount(target: any): void {
    this._filters.voteCountMin = target.value * 100;
  }

  getVoteCount(): number {
    return this._filters.voteCountMin / 100;
  }

  setKeywords(target: any): void {
    this.convertKeywordsToId(target.value);
  }

  searchButton(): void{

    if (!this.movieListComponent)
      return;

    let listComponent = this.movieListComponent;

    listComponent.changeCollapseFilter();
    listComponent.movieList = [];
    setTimeout(() => {
      FiltersComponent.staticFilters = this._filters;
      listComponent.getMovies();
    }, 100);
  }

  static setFilters(_filters: Filters, _date?: string) {
    if (_date)
      _filters.primaryReleaseDate = _date;

    FiltersComponent.staticFilters = _filters;
  }

}
