import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree, CanActivateChild, CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanLoad {

  constructor(private authService: AuthService, private router: Router) {}
  public canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.authService.isUserAdmin()) { return true; }
    this.router.navigate(['forbidden'], { queryParams: { returnUrl: this.router.url }});
    return false;
  }

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.authService.isUserAdmin()) { return true; }
      this.router.navigate(['forbidden'], { queryParams: { returnUrl: state.url }});
      return false;
  }
}
