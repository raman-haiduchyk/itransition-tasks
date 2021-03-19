import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Funfic } from 'src/app/core/models/funfic.model';
import { RequestService } from 'src/app/core/services/request.service';
import { mockedResponse } from '../../../core/mocked/response';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent {

  public funfics$: Observable<Funfic[]>;

  public dateFilterState: boolean = null;
  public salaryFilterState: boolean = null;
  public wordFilterState: string = null;
  public specFilterState: string[] = [];
  public minSalaryFilterState: number = 0;

  constructor(private filterService: FilterService, private requestService: RequestService) {
    filterService.onFilterChange.subscribe((filters) => {
      this.dateFilterState = filters[0];
      this.salaryFilterState = filters[1];
      this.wordFilterState = filters[2];
      this.specFilterState = filters[3];
      this.minSalaryFilterState = filters[4];
    });

    this.funfics$ = requestService.getFunficResponse();
   }
}
