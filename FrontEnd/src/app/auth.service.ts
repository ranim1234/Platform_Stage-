import { HttpClient, HttpClientModule, HttpClientXsrfModule, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs/operators';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private webService: WebRequestService,private router: Router, private http : HttpClient) {}

login(username: string, password: string) {
  return this.webService.login(username, password).pipe(
    shareReplay(),
    tap((res: HttpResponse<any>) => {
      this.setSession(res.body._id, (res.headers.get('x-access-token')|| ''), (res.headers.get('x-refresh-token')|| '') ) ; 
      console.log("LOGGED IN!");
    })
  ) 
  
} 
signup(nom: string,username:String,email:String, password: string,nom_faculte:String,specialite:String,niveau:String,description_competences:String) {
  return this.webService.signup(nom,username,email,password,nom_faculte,specialite,niveau,description_competences).pipe(
    shareReplay(),
    tap((res: HttpResponse<any>) => {
      this.setSession(res.body._id, (res.headers.get('x-access-token')|| ''), (res.headers.get('x-refresh-token')|| '') ) ; 
      console.log("Successfully signed up and now logged in!");
    })
  )
}
logout() {
  this.removeSession();

  this.router.navigate(['/']);
}
getAccessToken() {
  return localStorage.getItem('x-access-token');
}

getRefreshToken() {
  return localStorage.getItem('x-refresh-token');
}

getUserId() {
  return localStorage.getItem('user-id');
}

setAccessToken(accessToken: string) {
  localStorage.setItem('x-access-token', accessToken)
}
private setSession(userId: string, accessToken: string, refreshToken: string) {
  localStorage.setItem('user-id', userId);
  localStorage.setItem('x-access-token', accessToken);
  localStorage.setItem('x-refresh-token', refreshToken);
} 


private removeSession() {
  localStorage.removeItem('user-id');
  localStorage.removeItem('x-access-token');
  localStorage.removeItem('x-refresh-token');
}

getNewAccessToken() {
  return this.http.get(`${this.webService.ROOT_URL}/users/me/access-token`, {
    headers: {
      'x-refresh-token': this.getRefreshToken()  as string,
      '_id': this.getUserId()  as string
    },
    observe: 'response'
  }).pipe(
    tap((res: HttpResponse<any>) => {
       this.setAccessToken(res.headers.get('x-access-token')|| '');
    })
  )
} 


}