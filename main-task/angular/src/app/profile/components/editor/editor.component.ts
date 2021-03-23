import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Chapter } from 'src/app/core/models/chapter.model';
import { Funfic } from 'src/app/core/models/funfic.model';
import { RequestService } from 'src/app/core/services/request.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  public funfic: Funfic;
  public allTags: string[];
  public filteredTags: Observable<string[]>;
  public mode: string;
  public opened: boolean;

  @ViewChild('tagsInput') public tagsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') public matAutocomplete: MatAutocomplete;
  public tagsCtrl: FormControl = new FormControl();

  public separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(private requestService: RequestService, private route: ActivatedRoute) {
  }

  private checkInnerWidth(): void {
    if (window.innerWidth > 599) {
      this.mode = 'side';
      this.opened = true;
    } else {
      this.mode = 'over';
      this.opened = false;
    }
  }

  private filter(value: string): string[] {
    const filterValue: string = value.toLowerCase();
    return this.allTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
  }

  public ngOnInit(): void {

    this.checkInnerWidth();

    window.onresize = () => {
      this.checkInnerWidth();
    };

    this.route.params.subscribe(
      params => {
        this.requestService.getFunficByIdResponse(params.id).subscribe(funfic => {
          this.funfic = funfic;
          this.requestService.getChaptersResponse(params.id).subscribe(chapters => this.funfic.chapters = chapters);
        });
      }
    );

    this.requestService.getTagsResponse().subscribe(tags => {
      this.allTags = tags;
      this.filteredTags = this.tagsCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string) => fruit ? this.filter(fruit) : this.allTags));
    });
  }

  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.funfic.chapters, event.previousIndex, event.currentIndex);
  }

  public remove(tag: string): void {
    const index: number = this.funfic.tags.indexOf(tag);

    if (index >= 0) {
      this.funfic.tags.splice(index, 1);
    }
  }

  public add(event: MatChipInputEvent): void {
    const input: HTMLInputElement = event.input;
    const value: string = event.value;

    if ((value || '').trim()) { this.funfic.tags.push(value.trim()); }

    if (input) { input.value = ''; }

    this.tagsCtrl.setValue(null);
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    this.funfic.tags.push(event.option.viewValue);
    this.tagsInput.nativeElement.value = '';
    this.tagsCtrl.setValue(null);
  }

}
