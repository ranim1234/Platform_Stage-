import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ConnectComponent } from './connect/connect.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { RegisterNowComponent } from './register-now/register-now.component';
import { ProfileComponent } from './profile/profile.component';
import { TableauBordComponent } from './tableau-bord/tableau-bord.component';
import { ROUTING } from './app-routing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { WebReqInterceptor } from './web-req.interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ConnectComponent,
    SignInComponent,
    RegisterNowComponent,
    ProfileComponent,
    TableauBordComponent,
  

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ROUTING,
    HttpClientModule,
    FormsModule ,
    ReactiveFormsModule
  ],
  providers: [    { provide: HTTP_INTERCEPTORS, useClass: WebReqInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
