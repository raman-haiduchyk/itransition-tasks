import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReaderComponent } from './components/reader/reader.component';
import { MainPageComponent } from './components/main-page/main-page.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: ':id', component: ReaderComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
