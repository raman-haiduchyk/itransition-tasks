import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UsersComponent } from './components/users/users.component';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    UsersComponent
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
