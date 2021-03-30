import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { debounceTime, delay, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Chapter } from '../models/chapter.model';
import { UserComment } from '../models/comment.model';
import { CreateResponse } from '../models/create-request';
import { Funfic } from '../models/funfic.model';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private url: string = environment.urlAddress;

  constructor(private http: HttpClient) { }

  private createCompleteRoute(route: string, envAddress: string): string {
    return `${envAddress}/${route}`;
  }

  public createFunficResponse(route: string, name: string): Observable<CreateResponse> {
    return this.http.post<CreateResponse>(this.createCompleteRoute(route, this.url), {name: name});
  }

  public createFunficByIdResponse(route: string, name: string, id: string): Observable<CreateResponse> {
    return this.http.post<CreateResponse>(this.createCompleteRoute(route, this.url), {id: id, name: name});
  }

  public getFunficResponse(route: string): Observable<Funfic[]> {
    return this.http.get<Funfic[]>(this.createCompleteRoute(route, this.url));
  }

  public getFunficByIdResponse(route: string, id: string): Observable<Funfic> {
    return this.http.post<Funfic>(this.createCompleteRoute(route, this.url), {id: id});
  }

  public getFunficByUserIdResponse(route: string, id: string): Observable<Funfic[]> {
    return this.http.post<Funfic[]>(this.createCompleteRoute(route, this.url), {id: id});
  }

  // tslint:disable: no-any
  public changeFunfic(route: string, body: Funfic): Observable<any> {
    return this.http.post<any>(this.createCompleteRoute(route, this.url), body);
  }

  public deleteFunfic(route: string, id: string): Observable<any> {
    return this.http.post<any>(this.createCompleteRoute(route, this.url), {id: id});
  }

  public getTagsResponse(route: string): Observable<string[]> {
    return this.http.get<string[]>(this.createCompleteRoute(route, this.url));
  }

  public getCommentsResponse(route: string, funficId: string): Observable<UserComment[]> {
    return this.http.post<UserComment[]>(this.createCompleteRoute(route, this.url), {id: funficId});
  }

  public createCommentResponse(route: string, funficId: string, text: string): Observable<UserComment> {
    return this.http.post<UserComment>(this.createCompleteRoute(route, this.url), {id: funficId, text: text});
  }

  public setRatingResponse(route: string, funficId: string, stars: number): Observable<{rating: number}> {
    return this.http.post<{rating: number}>(this.createCompleteRoute(route, this.url), {id: funficId, stars: stars});
  }

  public getRatingResponse(route: string, funficId: string): Observable<{rating: number}> {
    return this.http.post<{rating: number}>(this.createCompleteRoute(route, this.url), {id: funficId });
  }

}
