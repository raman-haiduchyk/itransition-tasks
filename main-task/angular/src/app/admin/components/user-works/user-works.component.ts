import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Funfic } from 'src/app/core/models/funfic.model';
import { RequestService } from 'src/app/core/services/request.service';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';

@Component({
  selector: 'app-user-works',
  templateUrl: './user-works.component.html',
  styleUrls: ['./user-works.component.scss']
})
export class UserWorksComponent implements OnInit {

  public funfics: Funfic[] = null;
  public id: string = null;

  constructor(
    private requestService: RequestService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  public ngOnInit(): void {
    this.route.params.subscribe(
      params => {
        this.id = params.id;
        this.requestService.getFunficByUserIdResponse('funfics/getbyid', this.id).subscribe(
          funficRes => this.funfics = funficRes,
          err => this.dialog.open(ErrorDialogComponent)
        );
      }
    );
  }

  public onDelete($event: string): void {
    this.requestService.deleteFunfic('funfics/delete', $event).subscribe(
      res => {
        const index: number = this.funfics.findIndex(funfic => funfic.id === $event);
        if (index !== -1) {
          this.funfics.splice(index, 1);
          this.funfics = [...this.funfics];
        }
      },
      err => this.dialog.open(ErrorDialogComponent)
    );
  }

}
