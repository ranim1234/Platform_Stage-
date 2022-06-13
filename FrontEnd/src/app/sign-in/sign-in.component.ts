import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onLoginButtonClicked(username: string, password: string) {
    this.authService.login(username, password).subscribe((res: HttpResponse<any>) => {
      if (res.status === 200) {

        // we have logged in successfully
        this.router.navigate(['/user',res.body._id]); 
        console.log(res);
      }
      else{
        console.log("error") ; 
      }
      
    });
  }
}
