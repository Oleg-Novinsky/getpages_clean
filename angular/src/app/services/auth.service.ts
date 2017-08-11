import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';

const config = require('../../../../config/database');
const ipConnection = config.ipConnection;


@Injectable()
export class AuthService {

authToken: any;
user: any;

  constructor(private http:Http) { }

// Передача данных из формы
authenticateUser(user) {
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return this.http.post('http://'+ipConnection+'/users/authenticate', user, {headers: headers})
  .map(res => res.json());
}

// Запись token в Local Storage
storeUserData(token, user){
  localStorage.setItem('id_token', token);
  localStorage.setItem('username', user);
  this.authToken = token;
  this.user = user;
}

// Получаем token из Local Storage
loadToken(){
  const token = localStorage.getItem('id_token');
  this.authToken = token;
}

// Проверяем наличие token
loggedIn(){
  return tokenNotExpired('id_token');
}

logout(){
  this.authToken = null;
  this.user = null;
  localStorage.clear();
}

}
