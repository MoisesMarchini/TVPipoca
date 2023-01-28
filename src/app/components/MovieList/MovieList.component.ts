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


  movieList: Movie[] = [];
  responseList?: ListResponse;
  observer: any;
  loadMorePressed = false;

  collapseFilters = true;

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

  constructor(private moviesService: MoviesService) {
  }

  ngOnInit(): void {
    this.getMovies();
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
    this.getMovies(this.currentPage() + 1);
    this.loadMorePressed = true;
  }

  getMovies(page?: number): void {
    this.loadMorePressed = false;

    this.moviesService.getAllMovies(FiltersComponent.staticFilters, page).subscribe(
      (listResp: ListResponse) => {
        this.responseList = listResp;

        if (page != undefined && page > 1)
          this.movieList = this.movieList.concat(listResp.results);
        else
          this.movieList = listResp.results;

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

  changeTranformY() {
    if (this.collapseFilters)
      return;
    let result = -MovieListComponent.scrollY +"px";
    return result;
  }


  intersectionObserver() {
    let options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.25,
    };

    this.observer = new IntersectionObserver((entries) => {

      if (entries[0].isIntersecting) {
        this.loadMore(this.loadMorePressed);
      }

    }, options);
  }

  goUpBtn = () => {
    window.scroll(0, 0);
  }

  ////////////////////////////////////////////////
  ///////////////       MISC       ///////////////
  ////////////////////////////////////////////////

  changeCollapseFilter(): void{
    this.collapseFilters = !this.collapseFilters;
    // setTimeout(() => {
    //   window.scrollTo(0, MovieListComponent.scrollY);
    // }, 3);
  }

  movieClick(movie: Movie) {
    MovieComponent.selectedMovie = movie;
  }

}
