import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Chapter } from 'src/app/core/models/chapter.model';
import { Funfic } from 'src/app/core/models/funfic.model';
import { RequestService } from 'src/app/core/services/request.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  public funfic: Funfic;
  public chapters: Chapter[];

  public mode: string;
  public opened: boolean;

  public separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(private requestService: RequestService, private route: ActivatedRoute) { }

  private checkInnerWidth(): void {
    if (window.innerWidth > 599) {
      this.mode = 'side';
      this.opened = true;
    } else {
      this.mode = 'over';
      this.opened = false;
    }
  }

  public ngOnInit(): void {

    this.checkInnerWidth();

    window.onresize = () => {
      this.checkInnerWidth();
    };

    this.route.params.subscribe(
      params => {
        this.requestService.getFunficByIdResponse(params.id).subscribe(res => this.funfic = res);
        this.requestService.getChaptersResponse(params.id).subscribe(res => this.chapters = res);
      }
    );
  }

  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.chapters, event.previousIndex, event.currentIndex);

  }

}
