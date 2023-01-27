import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieListComponent } from './components/MovieList/MovieList.component';
import { MovieComponent } from './components/Movie/Movie.component';

const routes: Routes = [
  {path: 'MovieList', component: MovieListComponent},
  {path: 'Movie', component: MovieComponent},
  {path: '', redirectTo: '/MovieList', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule],
  declarations: [ ]
})
export class AppRoutingModule { }
