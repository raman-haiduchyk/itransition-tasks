import { HttpClient } from '@angular/common/http';
import { FacebookLoginProvider, MicrosoftLoginProvider, SocialAuthService, SocialUser, VKLoginProvider } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '../models/auth-res.model';
import { LoginRequest } from '../models/login-req.model';
import { RegistrationRequest } from '../models/register-req.model';
import { RegistrationResponse } from '../models/register-res.model';
import { Tokens } from '../models/tokens.model';
import { GoogleAuthRequest } from '../models/google-auth-req.model';
import { SocialAuthRequest } from '../models/social-auth-req.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: string = environment.urlAddress;

  private authChangeSub: Subject<boolean> = new Subject<boolean>();
  public authChanged: Observable<boolean> = this.authChangeSub.asObservable();

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService, private externalAuthService: SocialAuthService) { }

  private createCompleteRoute(route: string, envAddress: string): string {
    return `${envAddress}/${route}`;
  }

  public registerUser(route: string, body: RegistrationRequest): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(this.createCompleteRoute(route, this.url), body);
  }

  public loginUser(route: string, body: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.createCompleteRoute(route, this.url), body);
  }

  public externalGoogleLogin (route: string, body: GoogleAuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.createCompleteRoute(route, this.url), body);
  }

  public externalSocialLogin (route: string, body: SocialAuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.createCompleteRoute(route, this.url), body);
  }

  public signInWithGoogle(): Promise<SocialUser> {
    return this.externalAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  public signInWithFB(): Promise<SocialUser> {
    return this.externalAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  public signInWithMicrosoft(): Promise<SocialUser> {
    return this.externalAuthService.signIn(MicrosoftLoginProvider.PROVIDER_ID);
  }

  public signOutExternal = () => {
    this.externalAuthService.signOut();
  }

  public refreshToken(route: string): Observable<Tokens> {
    const accessToken: string = localStorage.getItem('accessToken');
    const refreshToken: string = localStorage.getItem('refreshToken');
    const tokens: Tokens = {accessToken: accessToken, refreshToken: refreshToken };
    return this.http.post<Tokens>(this.createCompleteRoute(route, this.url), tokens);
  }

  public logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.sendAuthStateChangeNotification(false);
  }

  public sendAuthStateChangeNotification(isAuthenticated: boolean): void {
    this.authChangeSub.next(isAuthenticated);
  }

  public isUserPotentialAuthenticated(): boolean {
    const accessToken: string = localStorage.getItem('accessToken');
    const refreshToken: string = localStorage.getItem('refreshToken');
    return (accessToken && refreshToken && true);
  }

  public isUserAuthenticated(): boolean {
    const token: string = localStorage.getItem('accessToken');
    return (token && !this.jwtHelper.isTokenExpired(token));
  }

  public isUserAdmin(): boolean {
    const token: string = localStorage.getItem('accessToken');
    if (!token) { return false; }
    const decodedToken: string = this.jwtHelper.decodeToken(token);
    const role: string = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return role === 'admin';
  }
}
