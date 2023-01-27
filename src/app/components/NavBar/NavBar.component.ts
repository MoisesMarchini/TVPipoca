import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MovieListComponent } from '../MovieList/MovieList.component';

@Component({
  selector: 'app-NavBar',
  templateUrl: './NavBar.component.html',
  styleUrls: ['./NavBar.component.sass']
})
export class NavBarComponent implements OnInit {

  @Input("MovieListComponent") movieListComponent: MovieListComponent | undefined;

  constructor() { }

  ngOnInit() {

  }



  @HostListener('window:scroll', ['$event']) onScroll() {
    if (window.scrollY > 10){
      this.hasScrollWindow = true;
      return
    }

    this.hasScrollWindow = false;
  }
  hasScrollWindow = false;

}
