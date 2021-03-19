import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  public dateFilter: boolean = null;
  public salaryFilter: boolean = null;
  public minSalaryFilter: number = null;
  public wordFilter: string = null;
  public specFilter: string[] = [];

  public onFilterChange: EventEmitter<[boolean, boolean, string, string[], number]> = new EventEmitter();

  constructor() { }

  public resetFilters(): void {
    this.dateFilter = null;
    this.salaryFilter = null;
    this.wordFilter = null;
    this.minSalaryFilter = null;
    this.specFilter = [];
  }

  public changeDateFilter(): void {
    this.salaryFilter = null;

    this.dateFilter != null
      ? this.dateFilter = !this.dateFilter
      : this.dateFilter = true;
    this.onFilterChange.emit([this.dateFilter, this.salaryFilter, this.wordFilter, this.specFilter, this.minSalaryFilter]);
  }

  public changeSalaryFilter(): void {
    this.dateFilter = null;

    this.salaryFilter != null
      ? this.salaryFilter = !this.salaryFilter
      : this.salaryFilter = true;
    this.onFilterChange.emit([this.dateFilter, this.salaryFilter, this.wordFilter, this.specFilter, this.minSalaryFilter]);
  }

  public changeWordFilter(word: string): void {
    this.wordFilter = word;
    this.onFilterChange.emit([this.dateFilter, this.salaryFilter, this.wordFilter, this.specFilter, this.minSalaryFilter]);
  }

  public changeMinSalaryFilter(minSalary: number): void {
    this.minSalaryFilter = minSalary;
    this.onFilterChange.emit([this.dateFilter, this.salaryFilter, this.wordFilter, this.specFilter, this.minSalaryFilter]);
  }

  public changeSpecFilter(specializations: string[]): void {
    this.specFilter = specializations;
    this.onFilterChange.emit([this.dateFilter, this.salaryFilter, this.wordFilter, this.specFilter, this.minSalaryFilter]);
  }
}
