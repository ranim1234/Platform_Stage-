import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
        selectedUser: User  ; 
        selectedId: string ;

  constructor(private router: Router,private route: ActivatedRoute,private use:UserService,private authService: AuthService ) {
    this.selectedId='' ; 
    this.selectedUser = new User("","","","","","","","","","","") ; 

   }

  ngOnInit(): void {
this.route.params.subscribe((params:Params)=>{
if(params.id){

this.selectedId = params.id ; 
this.use.identifier(this.selectedId).subscribe((user)=>{
console.log(user);
  this.selectedUser = user as User ; 
})

}


})
  } 


  log(){
this.authService.logout() ; 
  }
}
