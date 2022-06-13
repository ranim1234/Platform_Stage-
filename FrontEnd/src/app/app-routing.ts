import { RouterModule, Routes } from '@angular/router';
import { ConnectComponent } from './connect/connect.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { TableauBordComponent } from './tableau-bord/tableau-bord.component';
import { FormsModule } from '@angular/forms';



const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'connexion', component: ConnectComponent} ,
    {path: 'sign', component: SignInComponent}  , 
    { path: 'user/:id', component: ProfileComponent, children: [
      { path: 'tableau_bord', component: TableauBordComponent}
    ] }
   
    
    
    ]; 
  export  const ROUTING = RouterModule.forRoot(routes);
    