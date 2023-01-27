import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { MoviesService } from './Services/Movies.service';

import { AppComponent } from './app.component';
import { MovieListComponent } from './components/MovieList/MovieList.component';

import { HeaderComponent } from './components/Header/Header.component';
import { FooterComponent } from './components/Footer/Footer.component';
import { NavBarComponent } from './components/NavBar/NavBar.component';
import { MovieComponent } from './components/Movie/Movie.component';
import { FiltersComponent } from "./components/Filters/Filters.component";

@NgModule({
  declarations: [
    AppComponent,
      MovieListComponent,
      HeaderComponent,
      FooterComponent,
      NavBarComponent,
      MovieComponent,
      FiltersComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [MoviesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
