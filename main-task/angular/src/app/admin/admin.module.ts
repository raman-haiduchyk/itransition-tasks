import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UsersComponent } from './components/users/users.component';
import { UserService } from './services/user.service';
import { UserWorksComponent } from './components/user-works/user-works.component';
import { ProfileDialogComponent } from './components/profile-dialog/profile-dialog.component';
import { DeleteImplDialogComponent } from './components/delete-impl-dialog/delete-impl-dialog.component';

@NgModule({
  declarations: [
    UsersComponent, UserWorksComponent, ProfileDialogComponent, DeleteImplDialogComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ],
  exports: [
    UsersComponent
  ],
  providers: [UserService]
})
export class AdminModule { }
