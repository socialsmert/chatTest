import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'

interface myData {
  success: boolean,
  message: string,
  loginObject: {
    token: object
    user: {
      _id: string
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private user: object

  constructor(private http: HttpClient) { }

  setToken(token: string, id: string){
    if(token && id){
      localStorage.setItem('token', token);
      localStorage.setItem('id', id);
    }else{
      localStorage.clear();
    }
  }

  get isLoggedIn(){
    if(localStorage.token && localStorage.id){
      return true;
    }else{
      return false;
    }
  }


  get header(){
    return {headers: new HttpHeaders().set('Authorization', localStorage.token)}
  }

  authorize(email: string, password: string){
   return this.http.post<any>('http://localhost:3000/api/user/login', {email, password})
  }

  signUp(name, password, email, picture){
    return this.http.post<any>('http://localhost:3000/api/user/create', {
      name,
      password,
      email,
      picture,
      online: "true"
    })
  }
}
