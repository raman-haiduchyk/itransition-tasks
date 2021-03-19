import { EventEmitter, Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { debounceTime, delay, filter, map } from 'rxjs/operators';
import { chapterResponse } from '../mocked/chapters-response';
import { funficResponse } from '../mocked/funfic-response';
import { Chapter } from '../models/chapter.model';
import { Funfic } from '../models/funfic.model';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor() { }

  public getFunficResponse(): Observable<Funfic[]> {
    return of(funficResponse).pipe(delay(300));
  }

  public getFunficByIdResponse(funficId: string): Observable<Funfic> {
    return from (funficResponse).pipe(
      delay(300),
      filter(funfic => funfic.id === funficId)
    );
  }

  public getChaptersResponse(funficId: string): Observable<Chapter[]> {
    return of(chapterResponse).pipe(
      delay(300),
      map(arr => arr.filter(chap => chap.funficId === funficId))
    );
  }

}
