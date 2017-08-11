import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { GetpagesComponent } from './components/getpages/getpages.component';

import {GetpagesService} from './services/getpages.service';
import {AuthService} from './services/auth.service';
import {ValidateService} from './services/validate.service';

import {AuthGuard} from './guards/auth.guard';

const appRoutes: Routes = [
  {path: '', component: GetpagesComponent, canActivate:[AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'getpages', component: GetpagesComponent, canActivate:[AuthGuard]}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GetpagesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [GetpagesService, ValidateService, AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
