import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements HttpInterceptor {

  // TODO: parallel processing of refresh requests and avoiding refresh loops
  public refreshTokenInProgress: boolean = false;

  public tokenRefreshedSource: Subject<boolean> = new Subject();
  public tokenRefreshed$: Observable<boolean> = this.tokenRefreshedSource.asObservable();

  constructor(private router: Router, private authService: AuthService, private http: HttpClient) { }

  private handleOtherErrors(error: HttpErrorResponse): void {
    if (error.status === 404) {
      this.handleNotFound(error);
    } else if (error.status === 403) {
      this.handleForbidden(error);
    }
  }

  private handleForbidden(error: HttpErrorResponse): void {
    this.router.navigate(['forbidden'], { queryParams: { returnUrl: this.router.url }});
  }

  // tslint:disable: no-any typedef
  private handleUnauthorized(error: HttpErrorResponse, req: HttpRequest<any>): Observable<any> {
    if (this.authService.isUserPotentialAuthenticated()) {
      console.log('interceptor refreshing');
      return this.authService.refreshToken('token/refresh').pipe(
        switchMap((result) => {
          if (!result) {
            return throwError(error);
          }
          const newReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
          });
          return of(newReq);
        }),
        catchError(_ => {
          this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url }});
          return throwError(error);
        }));

    } else {
      if (!this.router.url.startsWith('/auth/login')) {
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url }});
        return throwError(error);
      }
    }
  }

  private handleNotFound(error: HttpErrorResponse): void {
    this.router.navigate(['notfound']);
  }

  // tslint:disable: no-any
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handleUnauthorized(error, req).pipe(
            switchMap((request) => next.handle(request))
          );
        } else {
          this.handleOtherErrors(error);
          return throwError(error);
        }
      })
    );
  }
}
