import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
  MsalService,
} from '@azure/msal-angular';
import { Observable } from 'rxjs/internal/Observable';
import { LogInRequest } from '../Models/loginRequest';
import { Subject } from 'rxjs';
import { InteractionType } from '@azure/msal-browser';
import { Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  loginType = 'normal';
  isLogedIn = false;
  userLogIn = new Subject();
  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private http: HttpClient,
    private router:Router
  ) {}

  getAccessToken(): Observable<any> {
    const request = {
      scopes: ['api://f7c8a089-a6be-4568-8420-82624daee35a/read'], // Specify the required scopes
    };

    return this.msalService.acquireTokenSilent(request);
  }

  getJwtToken(loginrequest: LogInRequest) {
    return this.http
      .post('https://localhost:44393/login', loginrequest)
      .subscribe((res) => {
        if (res != null) {
          localStorage.setItem('JWT_Token', JSON.stringify(res));
          this.isLogedIn = true;
          this.userLogIn.next('');
        }
      });
  }

  handleNormalLogOut() {
    localStorage.removeItem('JWT_Token');
    this.isLogedIn = false;
    this.userLogIn.next('');
    this.router.navigateByUrl('/')
  }

  handleMicrosoftLogOut() {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      this.msalService.logoutPopup({
        postLogoutRedirectUri: '/',
        mainWindowRedirectUri: '/',
      });
    } else {
      this.msalService.logoutRedirect({
        postLogoutRedirectUri: '/',
      });
    }
    this.router.navigateByUrl('/')
  }
}
