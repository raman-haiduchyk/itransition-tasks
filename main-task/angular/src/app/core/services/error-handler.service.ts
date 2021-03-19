import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements HttpInterceptor {

  constructor(private router: Router) { }

  private handleError(error: HttpErrorResponse): string {
    if (error.status === 404) {
      return this.handleNotFound(error);
    } else if (error.status === 401) {
      return this.handleUnauthorized(error);
    } else if (error.status === 403) {
      return this.handleForbidden(error);
    }
  }

  private handleForbidden(error: HttpErrorResponse): string {
    this.router.navigate(['forbidden'], { queryParams: { returnUrl: this.router.url }});
    return 'Forbidden';
  }

  private handleUnauthorized(error: HttpErrorResponse): string {
    if (this.router.url.startsWith('/auth/login')) {
      return 'Wrong login or password';
    } else {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url }});
      return error.message;
    }
  }

  private handleNotFound(error: HttpErrorResponse): string {
    this.router.navigate(['notfound']);
    return error.message;
  }

  // tslint:disable-next-line: no-any
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage: string = this.handleError(error);
        // error.error.errorMessage = errorMessage;
        console.log(error);
        return throwError(error);
      })
    );
  }
}
