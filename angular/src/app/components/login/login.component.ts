import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


username: String;
password: String;


  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

// Отправка данных из формы
onLoginSubmit(){
  const user = {
    username: this.username,
    password: this.password
  }

  this.authService.authenticateUser(user).subscribe(data => {
    if(data.success){
      console.log('You are logged in');
      this.authService.storeUserData(data.token, data.username);
      this.router.navigate(['getpages']);
    } else {
      console.log('Failed to log in');
    }
  });
}


}
