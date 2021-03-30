import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Profile } from '../../profile/models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  public url: string = `${environment.urlAddress}`;

  constructor(private http: HttpClient) { }

  private createCompleteRoute(route: string, envAddress: string): string {
    return `${envAddress}/${route}`;
  }

  public getProfile(route: string): Observable<Profile> {
    return this.http.get<Profile>(this.createCompleteRoute(route, this.url));
  }

  public setProfile(route: string, body: Profile): Observable<Profile> {
    return this.http.post<Profile>(this.createCompleteRoute(route, this.url), body);
  }

  public getProfileById(route: string, id: string): Observable<Profile> {
    return this.http.post<Profile>(this.createCompleteRoute(route, this.url), { id: id });
  }
}
