import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { AuthenticationService } from './Service/authentication.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService:AuthenticationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.authService.getAccessToken().pipe(
      switchMap((tokenResponse) => {
        // Clone the request and add the Authorization header
        const modifiedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${tokenResponse.accessToken}`,
          },
        });

        // Pass the modified request to the next handler
        return next.handle(modifiedRequest);
      })
    );
  
  }

  
}
