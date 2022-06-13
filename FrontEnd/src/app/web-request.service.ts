import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {
  readonly ROOT_URL;
  constructor(private http : HttpClient) { 
    this.ROOT_URL = 'http://localhost:8000' ; 
  }


find(id:String){

return this.http.get(`${this.ROOT_URL}/user/${id}`) ; 

}  
 update(id:String,payload: Object){

  return this.http.patch(`${this.ROOT_URL}/users/${id}`,payload, {responseType: 'text'})
 } 
 updatePassword(id:String,payload:object){
    return this.http.post(`${this.ROOT_URL}/user/${id}`,payload,{responseType: 'text'}) 
 }
findbord(id:String){

  return this.http.get(`${this.ROOT_URL}/user/${id}`) ; 
  
  } 
login(username: string, password: string) {
  return this.http.post(`${this.ROOT_URL}/users/login`, {
    username,
    password
  }, {
      observe: 'response'
    });
} 

signup(nom: string,username:String, email:String,password: string,nom_faculte:String,specialite:String,niveau:String,description_competences:String) {
  return this.http.post(`${this.ROOT_URL}/users`, {
    nom,
    username,
    email ,
    password,
    nom_faculte,
    specialite,
    niveau , 
    description_competences,
    
    
  }, {
      observe: 'response'
    });
} 
nombre(){
  return this.http.get(`${this.ROOT_URL}/`)
}

}