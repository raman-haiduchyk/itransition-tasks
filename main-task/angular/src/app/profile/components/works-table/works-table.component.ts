import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Funfic } from 'src/app/core/models/funfic.model';
import { RequestService } from 'src/app/core/services/request.service';

@Component({
  selector: 'app-works-table',
  templateUrl: './works-table.component.html',
  styleUrls: ['./works-table.component.scss']
})
export class WorksTableComponent implements OnInit {

  public funfics: MatTableDataSource<Funfic>;
  public displayedColumns: string[] = ['name', 'genre', 'chapters', 'rating', 'createdAt', 'views', 'read', 'edit', 'delete'];

  @ViewChild(MatPaginator)public paginator: MatPaginator;
  @ViewChild(MatSort)public sort: MatSort;

  constructor(private requestService: RequestService) { }

  public ngOnInit(): void {
    this.requestService.getFunficResponse()
    .subscribe(res => {
      this.funfics = new MatTableDataSource(res);
      this.funfics.sort = this.sort;
      this.funfics.paginator = this.paginator;
    });
  }

  public applyFilter(event: Event): void {
    const filterValue: string = (event.target as HTMLInputElement).value;
    this.funfics.filter = filterValue.trim().toLowerCase();

    if (this.funfics.paginator) {
      this.funfics.paginator.firstPage();
    }
  }

}
