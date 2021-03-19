import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileService } from './services/profile.service';
import { WorksTableComponent } from './components/works-table/works-table.component';

@NgModule({
  declarations: [ProfileComponent, WorksTableComponent],
  imports: [
    CommonModule,
    SharedModule,
    ProfileRoutingModule
  ],
  providers: [
    ProfileService
  ]
})
export class ProfileModule { }
