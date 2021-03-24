import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad, Route } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Tokens } from '../models/tokens.model';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad, CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  private async refreshTokens(): Promise<boolean> {

    if (!this.authService.isUserPotentialAuthenticated()) {
      this.router.navigate(['auth/login'], { queryParams: { returnUrl: this.router.url } });
      this.authService.sendAuthStateChangeNotification(false);
      return false;
    }

    return this.authService.refreshToken('token/refresh').toPromise();

  }

  public canLoad(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.authService.isUserAuthenticated() || this.authService.isUserPotentialAuthenticated()) {
      console.log('load guarad' + this.router.url);
      return true;
    } else {
      this.router.navigate(['auth/login'], { queryParams: { returnUrl: this.router.url } });
      this.authService.sendAuthStateChangeNotification(false);
      return false;
    }
  }

  public canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('activate guarad' + this.router.url);
    if (this.authService.isUserAuthenticated()) {
      return true;
    }
    return this.refreshTokens();
  }

}
