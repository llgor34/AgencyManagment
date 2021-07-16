import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbonamentyComponent } from './abonamenty/abonamenty.component';
import { AplikacjeComponent } from './aplikacje/aplikacje.component';
import { FakturyComponent } from './faktury/faktury.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'faktury', component: FakturyComponent },
  { path: 'aplikacje', component: AplikacjeComponent },
  { path: 'abonamenty', component: FetchDataComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }