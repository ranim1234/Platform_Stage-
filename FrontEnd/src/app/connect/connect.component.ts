import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css']
})
export class ConnectComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit(): void {
  }
  login() {   

    this.router.navigate(['/sign']) ; 
    }
    retour() {
      this.router.navigate(['/']) ; 
    }
}
