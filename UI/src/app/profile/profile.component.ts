import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MsalService } from '@azure/msal-angular';

const GRAPH_ENDPOINT = 'Enter_the_Graph_Endpoint_Herev1.0/me';

export class ProfileType {
  email?: string
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile!: ProfileType;

  constructor(
    private http: HttpClient,private authService:MsalService,
  ) { 
    
    this.profile = new ProfileType()
    this.profile.email = ""
    
  }

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    // const account = this.authService.instance.getAllAccounts()[0];

    // const accessTokenRequest = {
    //   scopes: ["user.read"],
    //   account: account,
    // };
    // this.authService.acquireTokenSilent(accessTokenRequest).subscribe((res)=>{

    //   let accessToken = res.accessToken
    //   const headers = new HttpHeaders({
    //     'Authorization': `Bearer ${accessToken}`,
    //   });
    
    //   // Make the API call using HttpClient
    //   this.http.get('https://localhost:44393/WeatherForecast')
    //   .subscribe(profile => {
    //     this.profile = profile;
    //   });


    // })
    this.http.get('https://localhost:44393/Profile')
      .subscribe(profile => {
        this.profile = profile;
      });
  }
}
