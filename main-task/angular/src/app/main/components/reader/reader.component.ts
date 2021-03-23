import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingChangeEvent } from 'angular-star-rating';
import { Subscription } from 'rxjs';
import { Chapter } from 'src/app/core/models/chapter.model';
import { Funfic } from 'src/app/core/models/funfic.model';
import { AuthService } from 'src/app/core/services/auth.service';
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

  public mode: string;
  public opened: boolean;

  public isAuthenticated: boolean;

  constructor(
    private route: ActivatedRoute, private router: Router, private requestService: RequestService, private authService: AuthService
  ) { }

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

    this.isAuthenticated = this.authService.isUserAuthenticated();

    if (!this.isAuthenticated) {

    }

    this.route.params.subscribe(
      params => {
        this.requestService.getFunficByIdResponse(params.id).subscribe(res => this.funfic = res);
        this.requestService.getChaptersResponse(params.id).subscribe(res => this.chapters = res);
      }
    );

    this.checkInnerWidth();

    window.onresize = () => {
      this.checkInnerWidth();
    };
  }

  public setChapter(index: number): void {
    this.currentChapter = index;
  }

  public onRatingChange(event$: RatingChangeEvent): void {
    console.log(event$.rating);
  }

}
