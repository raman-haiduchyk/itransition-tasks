import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { User } from 'src/app/admin/models/user.model';
import { UserService } from 'src/app/admin/services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { RequestService } from 'src/app/core/services/request.service';
import { CreateDialogComponent } from 'src/app/shared/components/create-dialog/create-dialog.component';
import { DeleteDialogComponent } from 'src/app/shared/components/delete-dialog/delete-dialog.component';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';
import { DeleteImplDialogComponent } from '../delete-impl-dialog/delete-impl-dialog.component';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public users: MatTableDataSource<User>;
  public displayedColumns: string[] = ['name', 'email', 'role', 'banned', 'change', 'ban', 'delete', 'funfics', 'info', 'create'];

  @ViewChild(MatPaginator)public paginator: MatPaginator;
  @ViewChild(MatSort)public sort: MatSort;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private requestService: RequestService,
    private profileService: ProfileService
    ) { }

  public ngOnInit(): void {
    this.userService.getUsers()
      .subscribe(
        res => {
          res.splice(res.findIndex(user => user.name === this.authService.getUserName()), 1);
          this.users = new MatTableDataSource(res);
          this.users.sort = this.sort;
          this.users.paginator = this.paginator;
        },
        err => this.dialog.open(ErrorDialogComponent)
      );
  }

  public banUser(id: string): void {

    this.userService.banUser(id)
      .subscribe(
        res => {
          res.splice(res.findIndex(user => user.name === this.authService.getUserName()), 1);
          this.users.data = res;
        },
        err => this.dialog.open(ErrorDialogComponent)
      );
  }

  public deleteUser(id: string): void {
    this.dialog.open(DeleteImplDialogComponent);
    // this.userService.deletUser(id)
    //   .subscribe(res =>
    //     this.users.data = res
    //   );
  }

  public changeRole(id: string): void {

    this.userService.changeRole(id)
      .subscribe(
        res => {
          res.splice(res.findIndex(user => user.name === this.authService.getUserName()), 1);
          this.users.data = res;
        },
        err => this.dialog.open(ErrorDialogComponent)
      );
  }

  public viewInfo(id: string): void {
    this.profileService.getProfileById('profile/profilebyid', id).subscribe(
      res => {
        this.dialog.open(ProfileDialogComponent, {data: res});
      },
      err => {
        this.dialog.open(ErrorDialogComponent);
      }
    );

  }

  public userWorks(id: string): void {

    this.router.navigate(['users', id]);
  }

  public applyFilter(event: Event): void {
    const filterValue: string = (event.target as HTMLInputElement).value;
    this.users.filter = filterValue.trim().toLowerCase();

    if (this.users.paginator) {
      this.users.paginator.firstPage();
    }
  }

  public create(id: string): void {
    // tslint:disable-next-line: typedef
    const dialogRef = this.dialog.open(CreateDialogComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.requestService.createFunficByIdResponse('funfics/createbyid', result, id).subscribe(
            res => this.router.navigate(['profile', 'editor', res.id]),
            err => this.dialog.open(ErrorDialogComponent)
          );
        }
      }
    );
  }

}
