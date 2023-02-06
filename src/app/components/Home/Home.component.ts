import { Component, OnInit } from '@angular/core';
import { Filters } from 'src/app/Domain/Filters';
import { ListResponse } from 'src/app/Domain/Models/ListResponse';
import { Movie } from 'src/app/Domain/Models/Movie';
import { SortBy } from 'src/app/Domain/SortBy.enum';
import { ListsDate } from 'src/app/Domain/ViewModels/ListsDate';
import { MoviesListsByTime } from 'src/app/Domain/ViewModels/MoviesListsByTime';
import { MoviesService } from 'src/app/Services/Movies.service';
import { FiltersComponent } from '../Filters/Filters.component';
import { MovieComponent } from '../Movie/Movie.component';

@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.sass']
})
export class HomeComponent implements OnInit {

  carouselInterval = 5;
  maxCarouselItems = 5;
  headerCarousel = 0;

  moviesMaxCount = 10;

  moviesTrending: Movie[] = [];
  moviesNewReleases: Movie[] = [];

  moviesMostPopular: Movie[] = [];
  moviesReviews: Movie[] = [];

  filtersNewReleases = new Filters({ sortBy: SortBy.releaseDateNew, voteCountMin: 50 });

  filtersPopular = new Filters({ sortBy: SortBy.popularityMost });
  filtersPopularTime = "alltime";

  filtersReviews = new Filters({ sortBy: SortBy.reviewMost, voteCountMin: 600 });
  filtersReviewsTime = "alltime";

  imgBannerUrl = 'https://image.tmdb.org/t/p/original/';
  imgPosterUrl = 'https://image.tmdb.org/t/p/w440_and_h660_face/';
  imgPosterUrlAlt = 'https://image.tmdb.org/t/p/original/';



  constructor(private moviesService: MoviesService) {
  }

  ngOnInit() {
    this.getTrendingMovies();
    this.getNewReleasesMovies();
    this.getMostPopularMovies("alltime");
    this.getMostReviewsMovies("alltime");
    this.carouselAnimated(this.carouselInterval);
  }

  carouselAnimated(defaultInterval: number) {
    setInterval(() => {
      if (this.carouselInterval < 1) {
        this.carouselInterval = defaultInterval /2;
        return;
      }
      this.carouselNext();
      this.carouselInterval = defaultInterval;
    }, defaultInterval * 1000)
  }

  carouselSet(slide: number) {
    this.headerCarousel = slide;
  }

  carouselNext() {
    this.carouselSet(this.carouselGetNext());
    this.carouselInterval = 0;
  }

  carouselPrevious() {
    this.carouselSet(this.carouselGetPrevious());
    this.carouselInterval = 0;
  }

  carouselGetNext() {
    if (this.headerCarousel + 1 >= this.moviesTrending.length)
      return 0;

    return this.headerCarousel + 1;
  }

  carouselGetPrevious() {
    if (this.headerCarousel - 1 < 0)
      return this.moviesTrending.length - 1;

    return this.headerCarousel - 1;
  }



  getTrendingMovies(): void {

    this.moviesService.getTrendingMovies().subscribe(
      (listResp: ListResponse) => {
        this.moviesTrending = listResp.results.filter((p, index ) => index < this.maxCarouselItems);
      },
      error => console.log(error)
    );

  }

  getNewReleasesMovies(): void {

    this.moviesService.getAllMovies(this.filtersNewReleases, 1).subscribe(
      (listResp: ListResponse) => {
        this.moviesNewReleases = listResp.results.filter((p, index) => index < this.moviesMaxCount);
      },
      error => console.log(error)
    );

  }

  getMostPopularMovies(byTime: string = ""): void {

    let primaryRelease = this.filtersPopular.primaryReleaseDate;

    switch (byTime) {
      case "week":
        primaryRelease = ListsDate.week;
        break;
      case "month":
        primaryRelease = ListsDate.month;
        break;
      case "year":
        primaryRelease = ListsDate.year;
        break;
      default:
        break;
    }

    this.filtersPopular.primaryReleaseDate = primaryRelease;

    this.moviesService.getAllMovies(this.filtersPopular, 1).subscribe(
      (listResp: ListResponse) => {
        this.moviesMostPopular = listResp.results.filter((p, index) => index < this.moviesMaxCount);
      },
      error => console.log(error)
    );
  }

  getMostReviewsMovies(byTime: string = ""): void {

    let primaryRelease = this.filtersReviews.primaryReleaseDate;

    switch (byTime) {
      case "week":
        primaryRelease = ListsDate.week;
        break;
      case "month":
        primaryRelease = ListsDate.month;
        break;
      case "year":
        primaryRelease = ListsDate.year;
        break;
      case "alltime":
        primaryRelease = "";
        break;
      default:
        break;
    }
    this.filtersReviews.primaryReleaseDate = primaryRelease;

    this.moviesService.getAllMovies(this.filtersReviews, 1).subscribe(
      (listResp: ListResponse) => {
        this.moviesReviews = listResp.results.filter((p, index) => index < this.moviesMaxCount);
      },
      error => console.log(error)
    );
  }

  setFilterDate(filter: Filters, byTime: string) {
    let primaryRelease = "";

    switch (byTime) {
      case "week":
        primaryRelease = ListsDate.week;
        break;
      case "month":
        primaryRelease = ListsDate.month;
        break;
      case "year":
        primaryRelease = ListsDate.year;
        break;
      case "alltime":
        primaryRelease = "";
        break;
      default:
        break;
    }

    filter.primaryReleaseDate = primaryRelease;

    if (filter == this.filtersPopular){
      this.filtersPopularTime = byTime;
    }

    if (filter == this.filtersReviews){
      this.filtersReviewsTime = byTime;
    }

    FiltersComponent.setFilters(filter);

  }

  movieClick(movie: Movie) {
    MovieComponent.selectedMovie = movie;
  }

  scrollWrapper(elementId: string, scroll: number = 1) {
    let wrapperIdentifier = elementId + '_wrapper';
    let wrapperElement = document.getElementById(wrapperIdentifier);
    if (!wrapperElement)
      return;

    let cardWidth = 180;
    let cardGap = 4;
    let newPos = cardWidth + cardGap;

    if (scroll < 0)
      newPos *= -1;

    wrapperElement.scrollLeft += newPos;

    let controlLeftIdentifier = elementId + '_control_left';
    let controlRightIdentifier = elementId + '_control_right';
    let controlLeftElement = document.getElementById(controlLeftIdentifier);
    let controlRightElement = document.getElementById(controlRightIdentifier);
    let maxScrollLeft = wrapperElement.scrollWidth - wrapperElement.clientWidth;

    if (!controlLeftElement || !controlRightElement)
      return

    if (wrapperElement.scrollLeft + newPos >= maxScrollLeft)
      controlRightElement.classList.add('inactive');
    else
      controlRightElement.classList.remove('inactive');

    if (wrapperElement.scrollLeft + newPos <= 0)
      controlLeftElement.classList.add('inactive');
    else
      controlLeftElement.classList.remove('inactive');
  }

}
