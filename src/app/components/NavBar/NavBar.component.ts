import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { Router } from '@angular/router';
import { FiltersComponent } from '../Filters/Filters.component';

@Component({
  selector: 'app-NavBar',
  templateUrl: './NavBar.component.html',
  styleUrls: ['./NavBar.component.sass']
})
export class NavBarComponent implements OnInit {

  hasScrollWindow = false;

  get collapseFilters() {
    return FiltersComponent.collapseFilters;
  }

  constructor(public router: Router, private location: Location) {

  }

  ngOnInit(): void {
  }

  backButton() {
    this.location.back();
  }

  changeCollapseFilter(){
    FiltersComponent.changeCollapseFilter();
  }

  @HostListener('window:scroll', ['$event']) onScroll() {
    if (window.scrollY > 10){
      this.hasScrollWindow = true;
      return;
    }

    this.hasScrollWindow = false;
  }

}
