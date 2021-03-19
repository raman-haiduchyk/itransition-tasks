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
    const tokenModel: Tokens = {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    };

    if (!tokenModel.accessToken || !tokenModel.refreshToken) {
      this.router.navigate(['auth/login'], { queryParams: { returnUrl: this.router.url } });
      this.authService.sendAuthStateChangeNotification(false);
      return false;
    }

    let result: boolean = null;

    await this.authService.refreshToken('token/refresh', tokenModel).toPromise()
    .then(
      (res) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        this.authService.sendAuthStateChangeNotification(true);
        result = true;
      })
    .catch(
      () => {
        this.router.navigate(['auth/login'], { queryParams: { returnUrl: this.router.url } });
        this.authService.sendAuthStateChangeNotification(false);
        result = false;
      }
    );

    return result;
  }

  public canLoad(
    route: Route): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.authService.isUserAuthenticated()) {
      return true;
    }
    return this.refreshTokens();
  }

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isUserAuthenticated()) {
      return true;
    }
    return this.refreshTokens();
  }

}
