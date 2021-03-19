import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReadComponent } from './components/read/read.component';
import { MainPageComponent } from './components/main-page/main-page.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: ':id', component: ReadComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
