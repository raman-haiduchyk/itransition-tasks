import { Component, Input, OnInit } from '@angular/core';
import { UserComment } from 'src/app/core/models/comment.model';
import { RequestService } from 'src/app/core/services/request.service';

@Component({
  selector: 'app-commmets',
  templateUrl: './commmets.component.html',
  styleUrls: ['./commmets.component.scss']
})
export class CommmetsComponent implements OnInit {

  @Input() public funficId: string;

  public comments: UserComment[];

  constructor(private requestService: RequestService) { }

  public ngOnInit(): void {
    this.requestService.getCommentsResponse(this.funficId).subscribe(
      res => this.comments = res
    );
  }

}
