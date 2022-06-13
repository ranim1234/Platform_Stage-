import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-tableau-bord',
  templateUrl: './tableau-bord.component.html',
  styleUrls: ['./tableau-bord.component.css']
})
export class TableauBordComponent implements OnInit {
	selectedUser: User  ; 
	selectedId: string ;
    confirmPassword : String ; 
	//url; //Angular 8
	url: any; //Angular 11, for stricter type
	msg = "";
	constructor(private use:UserService, private router: Router,private route:ActivatedRoute) { 
	
		this.selectedId='' ; 
		this.selectedUser = new User("","","","","","","","","","","") ; 
		this.confirmPassword = ' '  ;  
	}

	ngOnInit(): void {
		if(this.route.parent!=null){
		this.route.parent.params.subscribe((params:Params)=>{
		if(params['id']){
		
		this.selectedId = params['id']; 
		console.log(params.id) ; 
		this.use.identifier(this.selectedId).subscribe((user)=>{
		console.log(user);
		  this.selectedUser = user as User ; 
		  
            this.url = "/assets/images/"+this.selectedUser.photo ; 
		})
		}
		
		})
	}
	}
		
	//selectFile(event) { //Angular 8
	selectFile(event: any) { //Angular 11, for stricter type
		if(!event.target.files[0] || event.target.files[0].length == 0) {
			this.msg = 'You must select an image ' ; 
			return;
		}
		
		var mimeType = event.target.files[0].type;
		
		if (mimeType.match(/image\/*/) == null) {
			this.msg = "Only images are supported";
			return;
		}
		
		var reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		
		reader.onload = (_event) => {
			this.msg = "";
			this.url = reader.result; 
		}
	} 
	modifier(){ 
		this.use.edit(this.selectedId,this.selectedUser.nom,this.selectedUser.username,this.selectedUser.email,this.selectedUser.nom_faculte,this.selectedUser.specialite,this.selectedUser.niveau,this.selectedUser.description_competences).subscribe((res)=>{
        console.log("updated succesfully") ; 
		})
	} 
	modifierPassword(){
console.log(this.selectedUser.password) ;
console.log(this.confirmPassword) ; 
const valeur = this.selectedUser.password.toString().trim()===this.confirmPassword.toString().trim() ; 
console.log(valeur);
if (valeur){
this.use.editPassword(this.selectedId,this.selectedUser.password).subscribe((res)=>{
	console.log("updated succesfully") ; 
	
})
}else{
	console.log("err");
}
	}
}
