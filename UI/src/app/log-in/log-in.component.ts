import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationResult, AuthenticationScheme, InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { AuthenticationService } from '../Service/authentication.service';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { LogInRequest } from '../Models/loginRequest';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  loginForm!: FormGroup;
  
  constructor(private fb: FormBuilder, private authService:AuthenticationService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,private matDialog:MatDialog) { 
    
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.loginType = "normal";

      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      let logInRequest = new LogInRequest()
      logInRequest.password = password;
      logInRequest.userName = username;

      this.authService.getJwtToken(logInRequest)
      this.matDialog.closeAll();
    } 
   
  }

  microsoftLogIn()
  {
    this.authService.loginType = "microsoft";
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        this.msalService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.msalService.instance.setActiveAccount(response.account);
            this.authService.isLogedIn = true;
            this.authService.userLogIn.next('');
          });
      } else {
        this.msalService.loginPopup()
          .subscribe((response: AuthenticationResult) => {
            this.msalService.instance.setActiveAccount(response.account);
            this.authService.isLogedIn = true;
            this.authService.userLogIn.next('');
          });
      }
    } else {
      if (this.msalGuardConfig.authRequest) {
        this.msalService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
      } else {
        this.msalService.loginRedirect();
      }
    }
    this.matDialog.closeAll();
  }
}
