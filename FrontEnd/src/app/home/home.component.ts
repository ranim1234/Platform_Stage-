import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebRequestService } from '../web-request.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit { 
  nombres:any ; 
  constructor(private router : Router,private statics:WebRequestService) { }

  ngOnInit(){

   
    
    this.statics.nombre().subscribe((res)=>{
const str = JSON.stringify(res) ; 
   const strone =   str.substring(37,str.length-2) ;  
     this.nombres = strone  ; 
    })
  }
   myFunction() {
    var dots = document.getElementById("dots");
    var moreText = document.getElementById("more");
    var btnText = document.getElementById("myBtn");
    if((dots!==null && dots!==undefined)&&(moreText!==null && moreText!==undefined)&&(btnText!==null && btnText!==undefined)){
      if (dots.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerHTML = "Read more"; 
      moreText.style.display = "none";
    } else {
      dots.style.display = "none";
      btnText.innerHTML = "Read less"; 
      moreText.style.display = "inline";
    }
  }
} 
goToComponent(){

this.router.navigate(['/connexion']) ; 
} 

  

}
