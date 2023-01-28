import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/Home/Home.component';
import { MovieListComponent } from './components/MovieList/MovieList.component';
import { MovieComponent } from './components/Movie/Movie.component';

const routes: Routes = [
  {path: 'Home', component: HomeComponent},
  {path: 'MovieList', component: MovieListComponent},
  {path: 'Movie', component: MovieComponent},
  {path: '', redirectTo: '/Home', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule],
  declarations: [ ]
})
export class AppRoutingModule { }
