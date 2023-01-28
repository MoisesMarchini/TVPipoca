import { Component, Input, OnInit } from '@angular/core';
import { Filters } from 'src/app/Domain/Filters';
import { Actor } from 'src/app/Domain/Models/Credits/Actor';
import { CreditsResult } from 'src/app/Domain/Models/Credits/CreditsResult';
import { Production } from 'src/app/Domain/Models/Credits/Production';
import { Genre } from 'src/app/Domain/Models/Genre';
import { ListResponse } from 'src/app/Domain/Models/ListResponse';
import { Movie } from 'src/app/Domain/Models/Movie';
import { WatchProvider } from 'src/app/Domain/Models/WatchProvider';
import { WatchProviderSearch } from 'src/app/Domain/Models/WatchProviderSearch';
import { MoviesService } from 'src/app/Services/Movies.service';
import { FiltersComponent } from '../Filters/Filters.component';
import { MovieListComponent } from '../MovieList/MovieList.component';

@Component({
  selector: 'app-Movie',
  templateUrl: './Movie.component.html',
  styleUrls: ['./Movie.component.sass']
})
export class MovieComponent implements OnInit {

  static selectedMovie: Movie | undefined;
  MovieDetails = MovieComponent.selectedMovie;

  providerList: WatchProvider[] = [];
  actorsList: Actor[] = [];
  production: Production[] = [];
  genres: Genre[] = [];
  movieReleaseDate = new Date();

  imgUrl = 'https://image.tmdb.org/t/p/original/';

  constructor(private moviesService: MoviesService) {
    document.querySelector('html')!.style.scrollBehavior = 'auto';
  }

  ngOnInit() {
    if (!this.MovieDetails)
      this.getFirstMovie();

    this.getProviders();
    this.getCredits();
    this.getGenres();
    document.querySelector('html')!.style.scrollBehavior = 'smooth';

    if (!this.MovieDetails)
      return;

    this.movieReleaseDate = new Date(this.MovieDetails.release_date);
  }


  getFirstMovie() {
    this.moviesService.getAllMovies(new Filters()).subscribe(
      (listResp: ListResponse) => {
        this.MovieDetails = listResp.results[0];
      },
      error => {
        console.log(error)
      }
    );
  }

  getProviders() {
    if (!this.MovieDetails)
      return;
    this.moviesService.getProvidersList(this.MovieDetails.id).subscribe(
      (listResp: WatchProviderSearch) => {
        if(listResp.results.BR)
          this.providerList = listResp.results.BR.flatrate;
      },
      error => {
        console.log(error)
      }
    );
  }

  getCredits() {
    if (!this.MovieDetails)
      return;
    this.moviesService.getCreditsList(this.MovieDetails.id).subscribe(
      (listResp: CreditsResult) => {
        this.actorsList = listResp.cast;
        this.production = listResp.crew;
      },
      error => {
        console.log(error)
      }
    );
  }

  getGenres() {
    FiltersComponent.genreList.forEach((genre, index) => {
      if (this.genres.length == this.MovieDetails?.genre_ids.length)
        return;
      if (this.MovieDetails?.genre_ids.includes(genre.id))
        this.genres.push(genre);
    });
  }

  isOnNowWatch() {
    if (!this.MovieDetails)
      return false;
    let ytd = new Date();
    let timeDif = ytd.getTime() - this.movieReleaseDate.getTime();
    timeDif = Math.floor(timeDif / 3600000 / 24);
    return this.providerList.length == 0 && timeDif < 90;
  }

}
