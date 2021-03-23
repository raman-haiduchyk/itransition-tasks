import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from '../shared/shared.module';

import { FunficListComponent } from './components/funfic-list/funfic-list.component';
import { FunficCardComponent } from './components/funfic-card/funfic-card.component';
import { FilterBlockComponent } from './components/filter-block/filter-block.component';
import { StatBlockComponent } from './components/stat-block/stat-block.component';

import { FilterPipe } from './pipes/filter.pipe';

import { FilterService } from './services/filter.service';
import { ReaderComponent } from './components/reader/reader.component';
import { ChapterComponent } from './components/chapter/chapter.component';
import { StarRatingModule } from 'angular-star-rating';
import { CommentsComponent } from './components/commmets/comments.component';

@NgModule({
  declarations: [
    FunficListComponent,
    FunficCardComponent,
    FilterBlockComponent,
    StatBlockComponent,
    FilterPipe,
    ReaderComponent,
    ChapterComponent,
    CommentsComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule,
    StarRatingModule.forRoot(),
  ],
  exports: [
    FunficListComponent,
    FunficCardComponent,
    FilterBlockComponent,
    StatBlockComponent,
    FilterPipe,
    ReaderComponent,
    ChapterComponent,
  ],
  providers: [
    FilterService,
  ]
})
export class MainModule { }
