import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserWorksComponent } from './components/user-works/user-works.component';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: ':id', component: UserWorksComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
