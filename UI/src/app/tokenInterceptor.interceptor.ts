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
    if(this.authService.loginType == 'normal')
    {
      let jwtToken = JSON.parse( localStorage.getItem('JWT_Token')!);
      const modifiedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${jwtToken}`,
          'loginType':this.authService.loginType
        },
      });

      return next.handle(modifiedRequest);
    }
    else 
    {
      return this.authService.getAccessToken().pipe(
        switchMap((tokenResponse) => {
          const modifiedRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${tokenResponse.accessToken}`,
              'loginType':this.authService.loginType
            },
          });

          return next.handle(modifiedRequest);
        })
      );
    }
    
  
  }

  
}
