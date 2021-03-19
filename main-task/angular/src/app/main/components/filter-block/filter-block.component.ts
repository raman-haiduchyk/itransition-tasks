import { AfterViewInit, Component } from '@angular/core';
import { MatListOption } from '@angular/material/list';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-filter-block',
  templateUrl: './filter-block.component.html',
  styleUrls: ['./filter-block.component.scss']
})
export class FilterBlockComponent implements AfterViewInit {

  public dateArrowChar: string = null;
  public salaryArrowChar: string = null;

  public filterWordInputSub: Subscription;
  public filterSalaryInputSub: Subscription;

  constructor(private filterService: FilterService) { }

  public ngAfterViewInit(): void {

    this.filterWordInputSub = fromEvent(document.getElementById('filter-word-input'), 'input')
    .pipe(
      map((event: KeyboardEvent) => (event.target as HTMLInputElement).value),
      debounceTime(500),
      distinctUntilChanged())
    .subscribe(inputValue => {
      this.filterService.changeWordFilter(inputValue);
    });

    this.filterSalaryInputSub = fromEvent(document.getElementById('filter-salary-input'), 'input')
    .pipe(
      map((event: KeyboardEvent) => Number((event.target as HTMLInputElement).value)),
      debounceTime(300),
      distinctUntilChanged())
    .subscribe(inputValue => {
      this.filterService.changeMinSalaryFilter(inputValue);
    });
  }

  public changeDateFilterState(): void {
    this.filterService.changeDateFilter();
    this.salaryArrowChar = null;
    this.filterService.dateFilter
    ? this.dateArrowChar = '🠅'
    : this.dateArrowChar = '🠇';
  }

  public changeSalaryFilterState(): void {
    this.filterService.changeSalaryFilter();
    this.dateArrowChar = null;
    this.filterService.salaryFilter
    ? this.salaryArrowChar = '🠅'
    : this.salaryArrowChar = '🠇';
  }

  public changeSpecFilterState(options: MatListOption[]): void {
    this.filterService.changeSpecFilter(options.map(opt => opt.value));
  }

}
