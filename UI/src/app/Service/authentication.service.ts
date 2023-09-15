import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private msalService:MsalService) { }

   getAccessToken():Observable<any>{
    const request = {
      scopes: ['api://f7c8a089-a6be-4568-8420-82624daee35a/read'], // Specify the required scopes
    };

      return  this.msalService.acquireTokenSilent(request)  ;
    }
}
