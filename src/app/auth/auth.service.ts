import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginComponent } from '../login/login.component';
import { Token } from '@angular/compiler';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export  class  AuthService {
  private token: string;
  private loginSubject: Subject<string>;
  constructor(private http: HttpClient) {
  }

  public userAuthListener: Subject<string>;



  getToken(){
    return this.token;
  }
  addUsers(user: {email: string , password: string}){
    this.http.post('http://localhost:3000/api/auth/addUser', user).subscribe(res=>{
      console.log(res);
    });
 }
  getUserAuthListener(){
    return this.userAuthListener.asObservable();
  }
 login(values: any){
   const authData = {
     email : values.username,
     password : values.password
   };
   console.log(authData);
   this.http.post<{token?: string, message: string, user?: string}>('http://localhost:3000/api/auth/login', authData).subscribe(res=>{
     const token = res.token;
     this.token = token;
     if(res.message === 'user signed in successfully'){
       console.log('true');
     this.userAuthListener.next(res.user);
     } else {
       this.userAuthListener.next(' ');
     }
   });
 }


}

