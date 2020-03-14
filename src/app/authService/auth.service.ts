import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginComponent } from '../login/login.component';
import { Token } from '@angular/compiler';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment as env} from '../../environments/environment';
import { Users } from '../../../backend/models/user';
@Injectable({
  providedIn: 'root'
})
export  class  AuthService {
  private token: string;
  private userAuthenticated: boolean;
  private loginSubject: Subject<string>;
  constructor(private http: HttpClient, private router:Router) {
  }

  public userAuthListener: Subject<string>;



  getToken() {
    return this.token;
  }
  addUsers(user: {email: string , password: string, name: string, groupId: string }){
    return this.http.post<{message: string}>(env.apiUrl + '/auth/addUser', user);
 }

 getUserAuthenticated(){
   return this.userAuthenticated;
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
   this.http.post<{token?: string, message: string, user?: string,expiresIn?: number}>(env.apiUrl + '/auth/login', authData).subscribe(res=>{
     const token = res.token;
     this.token = token;
     console.log(res.expiresIn);
     if(res.message === 'user signed in successfully'){
       console.log('true');
       this.userAuthenticated = true;
       console.log(res.user);
     this.userAuthListener.next(res.user);
     const nowDate = new Date();
     const expiresAt = new Date(nowDate.getTime() + res.expiresIn * 1000);
   //  console.log(expiresAt);
     this.saveAuth(token,expiresAt.toLocaleString(),res.user);
     this.router.navigate(['main']);
     } else {
       this.userAuthListener.next(' ');
     }
   });
 }

  private saveAuth(token: string, expiresAt: string, user: string){
    localStorage.setItem('token', token);
    localStorage.setItem('expiresAt', expiresAt.toString());
    localStorage.setItem('userLogged', user);
  }

  logout(){
     this.router.navigate(['/home']);
  }

   getUsers() :Observable<any>{

    return this.http.get(env.apiUrl + '/auth/getUsers');

   }

  searchGroup(query: Number):Observable<Users>{
    console.log('searchGroup')
    return this.http.get<Users[]>(env.apiUrl + '/auth/searchGroup/' + query);
 }

 searchMaxGroupId():Observable<Users>
 {
   return this.http.get<Users>(env.apiUrl + '/auth/searchMaxGroupId');
 }


}

