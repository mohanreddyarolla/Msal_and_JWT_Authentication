import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus, InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { LogInComponent } from './log-in/log-in.component';
import { AuthenticationService } from './Service/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'MSAL Sample';
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();
  visible: boolean = false;


  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: AuthenticationService,
    private msalBroadcastService: MsalBroadcastService,
    public dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    // this.isIframe = window !== window.parent && !window.opener;

    // this.msalBroadcastService.inProgress$
    //   .pipe(
    //     filter((status: InteractionStatus) => status === InteractionStatus.None),
    //     takeUntil(this._destroying$)
    //   )
    //   .subscribe(() => {
    //     this.setLoginDisplay();
    //   });

    this.authService.userLogIn.subscribe(() => {
      this.loginDisplay = this.authService.isLogedIn;
    })
  }

  
  showDialog() {
    this.visible = true;
}

  // setLoginDisplay() {
  //   this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  // }

  login() {
    this.dialog.open(LogInComponent)
    // if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
    //   if (this.msalGuardConfig.authRequest) {
    //     this.authService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
    //       .subscribe((response: AuthenticationResult) => {
    //         this.authService.instance.setActiveAccount(response.account);
    //       });
    //   } else {
    //     this.authService.loginPopup()
    //       .subscribe((response: AuthenticationResult) => {
    //         this.authService.instance.setActiveAccount(response.account);
    //       });
    //   }
    // } else {
    //   if (this.msalGuardConfig.authRequest) {
    //     this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
    //   } else {
    //     this.authService.loginRedirect();
    //   }
    // }
  }

  logout() {
    // if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
    //   this.authService.logoutPopup({
    //     postLogoutRedirectUri: "/",
    //     mainWindowRedirectUri: "/"
    //   });
    // } else {
    //   this.authService.logoutRedirect({
    //     postLogoutRedirectUri: "/",
    //   });
    //}

    if(this.authService.loginType == 'normal')
    this.authService.handleNormalLogOut()
    else 
    this.authService.handleMicrosoftLogOut()
  }

  // ngOnDestroy(): void {
  //   this._destroying$.next(undefined);
  //   this._destroying$.complete();
  // }
}
