import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.urlAddress}/users/all`);
  }

  public changeRole(id: string): Observable<User[]> {
    return this.http.post<User[]>(`${environment.urlAddress}/users/change`, {Id: id});
  }

  public deletUser(id: string): Observable<User[]> {
    return this.http.post<User[]>(`${environment.urlAddress}/users/delete`, {Id: id});
  }

  public banUser(id: string): Observable<User[]> {
    return this.http.post<User[]>(`${environment.urlAddress}/users/ban`, {Id: id});
  }
}
