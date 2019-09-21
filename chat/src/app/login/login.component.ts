import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  email: string;
  password: string;

  regEmail: string;
  regPassword: string;
  regPassword2: string;
  regName: string;
  regPicture: string;


  constructor(private Auth: AuthService, private router: Router) { }


  ngOnInit() {

  }

  loginClient(){
   this.Auth.authorize(this.email, this.password).subscribe(data => {
     if(data.success){
      const token: string = data.loginObject.token.toString()
      const id: string = data.loginObject.user._id
      this.Auth.setToken(token, id);
      this.router.navigate(['chat']) 
     }else{
      window.alert('Login error');
     }
   })
  }

  logoutClient(){
    localStorage.clear(); 
  }

  signUp(){
    if(this.regPassword == this.regPassword2){
    this.Auth.signUp(this.regName, this.regPassword, this.regEmail, this.regPicture).subscribe( data => {
      if(data){
        console.log(data);
        this.email = data.email
        this.password = this.regPassword
        this.loginClient();
      }
    })
  }else{
    alert("Enter valid passwords!")
  }
  }

}
