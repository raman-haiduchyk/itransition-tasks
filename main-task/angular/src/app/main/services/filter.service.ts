import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  public dateFilter: boolean = null;
  public scoreFilter: boolean = null;
  public viewsFilter: boolean = null;
  public wordFilter: string = null;
  public tagsFilter: string[] = [];

  public onFilterChange: EventEmitter<[boolean, boolean, string, string[], boolean]> = new EventEmitter();

  constructor() { }

  public resetFilters(): void {
    this.dateFilter = null;
    this.scoreFilter = null;
    this.viewsFilter = null;
    this.wordFilter = null;
    this.tagsFilter = [];
  }

  public changeDateFilter(): void {
    this.scoreFilter = null;
    this.viewsFilter = null;

    this.dateFilter != null
      ? this.dateFilter = !this.dateFilter
      : this.dateFilter = true;
    this.onFilterChange.emit([this.dateFilter, this.scoreFilter, this.wordFilter, this.tagsFilter, this.viewsFilter]);
  }

  public changeScoreFilter(): void {
    this.dateFilter = null;
    this.viewsFilter = null;

    this.scoreFilter != null
      ? this.scoreFilter = !this.scoreFilter
      : this.scoreFilter = true;
    this.onFilterChange.emit([this.dateFilter, this.scoreFilter, this.wordFilter, this.tagsFilter, this.viewsFilter]);
  }

  public changeWordFilter(word: string): void {
    this.wordFilter = word;
    this.onFilterChange.emit([this.dateFilter, this.scoreFilter, this.wordFilter, this.tagsFilter, this.viewsFilter]);
  }

  public changeViewsFilter(): void {
    this.dateFilter = null;
    this.scoreFilter = null;

    this.viewsFilter != null
      ? this.viewsFilter = !this.viewsFilter
      : this.viewsFilter = true;

    this.onFilterChange.emit([this.dateFilter, this.scoreFilter, this.wordFilter, this.tagsFilter, this.viewsFilter]);
  }

  public changeTagsFilter(tags: string[]): void {
    this.tagsFilter = tags;
    this.onFilterChange.emit([this.dateFilter, this.scoreFilter, this.wordFilter, this.tagsFilter, this.viewsFilter]);
  }
}
