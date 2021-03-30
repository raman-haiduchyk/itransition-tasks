import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, Output, ViewChild, EventEmitter, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { RequestService } from '../../../core/services/request.service';

@Component({
  selector: 'app-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.scss']
})
export class TagInputComponent implements OnInit {

  // tslint:disable-next-line: typedef
  @Output() public tagsChange = new EventEmitter<string[]>();
  @Input() public initTags: string[] = [];

  public allTags: string[] = [];
  public selectedTags: string[] = [];
  public filteredTags: Observable<string[]>;
  public mode: string;
  public opened: boolean;

  @ViewChild('tagsInput') public tagsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') public matAutocomplete: MatAutocomplete;
  public tagsCtrl: FormControl = new FormControl();

  public separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(private requestService: RequestService) {
  }

  private filter(value: string): string[] {
    return this.allTags.filter(tag => tag.toLowerCase().indexOf(value.toLowerCase()) === 0);
  }

  public ngOnInit(): void {
    this.selectedTags = this.initTags;
    this.requestService.getTagsResponse('rating/tags').subscribe(tags => {
      this.allTags = tags;
      this.filteredTags = this.tagsCtrl.valueChanges.pipe(
        startWith(null),
        map((tag: string | null) => tag ? this.filter(tag) : this.allTags.slice()));
    });
  }

  public remove(tag: string): void {
    const index: number = this.selectedTags.indexOf(tag);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
      this.tagsChange.emit(this.selectedTags);
    }
  }

  public add(event: MatChipInputEvent): void {
    const input: HTMLInputElement = event.input;
    const value: string = event.value;

    if ((value || '').trim()) {
      this.selectedTags.push(value.trim());
      this.tagsChange.emit(this.selectedTags);
    }

    if (input) { input.value = ''; }

    this.tagsCtrl.setValue('');
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedTags.push(event.option.viewValue);
    this.tagsInput.nativeElement.value = '';
    this.tagsCtrl.setValue('');
    event.option.deselect();
    this.tagsChange.emit(this.selectedTags);
  }
}
