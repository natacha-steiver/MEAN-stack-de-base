import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable,throwError } from 'rxjs';
 import { catchError,map } from 'rxjs/operators';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService) {}
  
intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  return next.handle(request).pipe(map(event => {
      return event;
  }), catchError(err => {
      if (err.status === 401) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${this.auth.getToken()}`
          }
        });
        
        console.log("intercept");
        return next.handle(request);
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
  }),
  )
}
}
