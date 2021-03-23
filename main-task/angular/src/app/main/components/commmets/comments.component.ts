import { Component, Input, OnInit } from '@angular/core';
import { UserComment } from 'src/app/core/models/comment.model';
import { RequestService } from 'src/app/core/services/request.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  @Input() public funficId: string;

  public comments: UserComment[];

  constructor(private requestService: RequestService) { }

  public ngOnInit(): void {
    this.requestService.getCommentsResponse(this.funficId).subscribe(
      res => this.comments = res
    );
  }

}
