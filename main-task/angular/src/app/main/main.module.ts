import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from '../shared/shared.module';

import { JobListComponent } from './components/funfic-list/job-list.component';
import { FunficCardComponent } from './components/funfic-card/funfic-card.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { FilterBlockComponent } from './components/filter-block/filter-block.component';
import { StatBlockComponent } from './components/stat-block/stat-block.component';

import { FilterPipe } from './pipes/filter.pipe';

import { FilterService } from './services/filter.service';
import { ReadComponent } from './components/read/read.component';
import { ChapterComponent } from './components/chapter/chapter.component';
import { StarRatingModule } from 'angular-star-rating';

@NgModule({
  declarations: [
    JobListComponent,
    FunficCardComponent,
    MainPageComponent,
    FilterBlockComponent,
    StatBlockComponent,
    FilterPipe,
    ReadComponent,
    ChapterComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule,
    StarRatingModule.forRoot(),
  ],
  exports: [
    JobListComponent,
    FunficCardComponent,
    MainPageComponent,
    FilterBlockComponent,
    StatBlockComponent,
    FilterPipe,
    ReadComponent,
    ChapterComponent,
  ],
  providers: [
    FilterService,
  ]
})
export class MainModule { }
