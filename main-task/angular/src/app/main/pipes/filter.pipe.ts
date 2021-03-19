import { Pipe, PipeTransform } from '@angular/core';
import { Job } from 'src/app/core/models/job.model';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  public transform(
    items: Job[],
    dateFilter: boolean,
    salaryFilter: boolean,
    wordFilter: string,
    specFilter: string[],
    minSalaryFilter: number): Job[] {

    if (items != null) {
      if (dateFilter != null) {
        items.sort((a, b) => {
          let dateA: number = (new Date(a.createdAt)).getTime();
          let dateB: number = (new Date(b.createdAt)).getTime();
          return dateFilter ? dateB - dateA : dateA - dateB;
        });

      } else if (salaryFilter != null) {
        items.sort((a, b) => {
          let viewCountA: number = Number(a.salary);
          let viewCountB: number = Number(b.salary);
          return salaryFilter ? viewCountA - viewCountB : viewCountB - viewCountA;
        });
      }

      if (wordFilter) {
        items = items.filter(
          item =>
            item.name.toLowerCase().includes(wordFilter.toLowerCase()) ||
            item.company.name.toLowerCase().includes(wordFilter.toLowerCase()));
      }

      if (specFilter && specFilter.length) {
        items = items.filter(item => specFilter.includes(item.specialization.toLowerCase()));
      }

      if (minSalaryFilter) {
        items = items.filter (item => item.salary >= minSalaryFilter);
      }
    }
    return items;
  }
}
