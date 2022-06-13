import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private webService: WebRequestService,private router: Router, private http : HttpClient ) { } 

  identifier(id:String){
return this.webService.find(id) ; 
 
  } 
  identifierbord(id:String){
    return this.webService.findbord(id) ; 
     
      }  
 
     edit(id:String,nom:String,username:String,email:String,nom_faculte:String,specialite:String,niveau:String,description_competences:String) {
       return this.webService.update(id,{nom,username,email,nom_faculte,specialite,niveau,description_competences});
     } 


     editPassword(id:String,password:String){
       return this.webService.updatePassword(id,{password}) ; 
     }
}
