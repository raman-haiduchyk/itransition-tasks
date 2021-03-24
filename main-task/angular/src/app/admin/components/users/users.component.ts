import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { User } from 'src/app/admin/models/user.model';
import { UserService } from 'src/app/admin/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public users: MatTableDataSource<User>;
  public displayedColumns: string[] = ['name', 'email', 'role', 'banned', 'change', 'ban', 'delete', 'funfics'];

  @ViewChild(MatPaginator)public paginator: MatPaginator;
  @ViewChild(MatSort)public sort: MatSort;

  constructor(private userService: UserService, public dialog: MatDialog) { }

  public ngOnInit(): void {
    this.userService.getUsers()
      .subscribe(res => {
        this.users = new MatTableDataSource(res);
        this.users.sort = this.sort;
        this.users.paginator = this.paginator;
      });
  }

  public banUser(id: string): void {

    this.userService.banUser(id)
      .subscribe(res =>
        this.users.data = res
      );
  }

  public deleteUser(id: string): void {
    this.dialog.open(DialogTemplateComponent);
    // this.userService.deletUser(id)
    //   .subscribe(res =>
    //     this.users.data = res
    //   );
  }

  public changeRole(id: string): void {

    this.userService.changeRole(id)
      .subscribe(res =>
        this.users.data = res
      );
  }

  public applyFilter(event: Event): void {
    const filterValue: string = (event.target as HTMLInputElement).value;
    this.users.filter = filterValue.trim().toLowerCase();

    if (this.users.paginator) {
      this.users.paginator.firstPage();
    }
  }

}

@Component({
  selector: 'dialog-template',
  templateUrl: './dialog.template.html',
})
export class DialogTemplateComponent {}
