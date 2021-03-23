import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileService } from './services/profile.service';
import { WorksTableComponent } from './components/works-table/works-table.component';
import { EditorComponent } from './components/editor/editor.component';
import { QuillModule } from 'ngx-quill';
import { modules } from './editor.options';

@NgModule({
  declarations: [ProfileComponent, WorksTableComponent, EditorComponent],
  imports: [
    CommonModule,
    SharedModule,
    ProfileRoutingModule,
    QuillModule.forRoot({
      modules: modules
    })
  ],
  providers: [
    ProfileService
  ]
})
export class ProfileModule { }
