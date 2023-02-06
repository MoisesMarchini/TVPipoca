import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ListResponse } from '../../Domain/Models/ListResponse';
import { Movie } from '../../Domain/Models/Movie';
import { Genre } from '../../Domain/Models/Genre';
import { MoviesService } from '../../Services/Movies.service';
import { Filters } from 'src/app/Domain/Filters';
import { WatchProvider } from 'src/app/Domain/Models/WatchProvider';
import { ConditionalExpr } from '@angular/compiler';
import { FiltersComponent } from '../Filters/Filters.component';
import { MovieComponent } from '../Movie/Movie.component';

@Component({
  selector: 'app-MovieList',
  templateUrl: './MovieList.component.html',
  styleUrls: ['./MovieList.component.scss']
})
export class MovieListComponent implements OnInit, AfterViewInit {

  @ViewChildren('lastMovieseen', { read: ElementRef }) lastMovieSeen: QueryList<ElementRef> | undefined;
  @ViewChildren('lastMovie', { read: ElementRef }) lastMovieList: QueryList<ElementRef> | undefined;

  imgUrl = 'https://image.tmdb.org/t/p/w440_and_h660_face/';


  static movieList: Movie[] = [];
  get _movieList() { return MovieListComponent.movieList; };
  static responseList?: ListResponse;
  observer: any;

  static loadMorePressed = false;
  get _loadMorePressed() { return MovieListComponent.loadMorePressed };
  static moviesService: MoviesService;
  get _collapseFilters() { return FiltersComponent.collapseFilters};

  public lastPage = () => {

    if (MovieListComponent.responseList != null)
      return Math.min(500, MovieListComponent.responseList.total_pages);

    return 1;
  };
  public firstPage = () => {
    return 1;
  };
  public currentPage = () => {

    if (MovieListComponent.responseList != null)
      return MovieListComponent.responseList.page;

    return 1;
  };
  public nextPage = () => {

    if (MovieListComponent.responseList != null)
      return MovieListComponent.responseList.page + 1;

    return 1;
  };
  public prevPage = () => {

    if (MovieListComponent.responseList != null)
      return MovieListComponent.responseList.page - 1;

    return 1;
  };

  constructor(private _moviesService: MoviesService) {
    MovieListComponent.moviesService = this._moviesService;
  }

  ngOnInit(): void {
    MovieListComponent.getMovies();
    this.intersectionObserver();
  }

  ngAfterViewInit() {
    this.lastMovieList?.changes.subscribe((d) => {
      if (d.last)
        this.observer.observe(d.last.nativeElement);
    })
  }

  ////////////////////////////////////////////////
  ///////////////     SERVICES     ///////////////
  ////////////////////////////////////////////////

  loadMore(fetch: boolean): void{
    if (!fetch)
      return;
      MovieListComponent.getMovies(this.currentPage() + 1);
    MovieListComponent.loadMorePressed = true;
  }

  static getMovies(page?: number): void {
    MovieListComponent.loadMorePressed = false;

    MovieListComponent.moviesService.getAllMovies(FiltersComponent.staticFilters, page).subscribe(
      (listResp: ListResponse) => {
        MovieListComponent.responseList = listResp;

        if (page != undefined && page > 1)
          MovieListComponent.movieList = MovieListComponent.movieList.concat(listResp.results);
        else
          MovieListComponent.movieList = listResp.results;

      },
      error => console.log(error)
    );
  }

  getPagination(): number[] {
    let pagination:number[] = [];
    let totalPagination = 9;
    let firstMovieList = 1;

    if (this.currentPage() > Math.floor(totalPagination/2))
      firstMovieList = this.currentPage() - Math.floor(totalPagination / 2);

      if (this.lastPage() - this.currentPage() < Math.floor(totalPagination/2))
        firstMovieList = this.lastPage() - totalPagination +1;


    for (let i = 0; i < totalPagination; i++) {
      let element = i + firstMovieList;
      pagination.push(element);
    }

    return pagination;
  }

  ////////////////////////////////////////////////
  ///////////////      SCROLL      ///////////////
  ////////////////////////////////////////////////

  static scrollY = 0;
  hasScrollWindow = false;

  @HostListener('window:scroll', ['$event']) onScroll() {
    if (window.scrollY > 0){
      this.hasScrollWindow = true;
      MovieListComponent.scrollY = window.scrollY;
      return
    }

    this.hasScrollWindow = false;
  }

  // changeTranformY() {
  //   if (this._collapseFilters)
  //     return;
  //   let result = -MovieListComponent.scrollY +"px";
  //   return result;
  // }


  intersectionObserver() {
    let options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.25,
    };

    this.observer = new IntersectionObserver((entries) => {

      if (entries[0].isIntersecting) {
        this.loadMore(MovieListComponent.loadMorePressed);
      }

    }, options);
  }

  goUpBtn = () => {
    window.scroll(0, 0);
  }

  ////////////////////////////////////////////////
  ///////////////       MISC       ///////////////
  ////////////////////////////////////////////////

  _changeCollapseFilter(): void{
    FiltersComponent.changeCollapseFilter();
  }

  movieClick(movie: Movie) {
    MovieComponent.selectedMovie = movie;
  }

}
