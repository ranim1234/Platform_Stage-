import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-register-now',
  templateUrl: './register-now.component.html',
  styleUrls: ['./register-now.component.css']
})
export class RegisterNowComponent implements OnInit {
  currentInput: any;

  constructor(private authService: AuthService, private router: Router ) { }

  ngOnInit(): void {
  }
  
    

  add() {
    var dots = document.getElementById("dots");
    var dotstwo = document.getElementById("dotstwo");

   if((dots!==null && dots!==undefined)&&(dotstwo!==null && dotstwo!==undefined)){
      if (dots.style.display === "none") {
      dots.style.display = "grid"; 
      dotstwo.style.display="none" ; 
    } else if (dots.style.display = "grid"){
      dots.style.display = "none";
    }
  }
} 
addtwo() {
  var dotstwo = document.getElementById("dotstwo");
  var dots = document.getElementById("dots");

 if((dotstwo!==null && dotstwo!==undefined)&&(dots!==null && dots!==undefined)){
    if (dotstwo.style.display === "none") {
    dotstwo.style.display = "grid";
    dots.style.display="none" ; 
  } else if (dotstwo.style.display = "grid"){
    dotstwo.style.display = "none";
  }
}
} 
onFileSelected(event:any) {
  if(event.target.files.length > 0) 
   {
     this.currentInput = event.target.files[0] ; 
    

   }
 }
login() {   

  this.router.navigate(['/sign']) ; 
  } 
  
  create(nom: string,username:String,email:String, password: string,nom_faculte:String,specialite:String,niveau:String,description_competences:String){
   // const formdata = new FormData();
    //formdata.append('files', this.currentInput);
this.authService.signup(nom,username,email,password,nom_faculte,specialite,niveau,description_competences).subscribe((response:HttpResponse<any>)=>{

  console.log(response) ; 
  this.router.navigate(['/user',response.body._id]); 
})
    
  

 
}
}
