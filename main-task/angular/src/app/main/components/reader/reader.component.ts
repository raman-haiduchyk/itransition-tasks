import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingChangeEvent } from 'angular-star-rating';
import { Subscription } from 'rxjs';
import { Chapter } from 'src/app/core/models/chapter.model';
import { Funfic } from 'src/app/core/models/funfic.model';
import { RequestService } from 'src/app/core/services/request.service';

@Component({
  selector: 'app-detailed-info',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.scss']
})
export class ReaderComponent implements OnInit {
  public itemSub: Subscription;

  public funfic: Funfic;
  public chapters: Chapter[];
  public currentChapter: number = 0;
  public rating: number = 3;

  constructor(private route: ActivatedRoute, private router: Router, private requestService: RequestService
    ) { }

  public ngOnInit(): void {
    this.route.params.subscribe(
      params => {
        this.requestService.getFunficByIdResponse(params.id).subscribe(res => this.funfic = res);
        this.requestService.getChaptersResponse(params.id).subscribe(res => this.chapters = res);
      }
    );
  }

  public setChapter(index: number): void {
    this.currentChapter = index;
  }

  public onRatingChange(event$: RatingChangeEvent): void {
    console.log(event$.rating);
  }

}
