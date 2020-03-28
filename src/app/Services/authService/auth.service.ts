import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment as env} from '../../../environments/environment';
import { Users } from '../../../../backend/models/user';
@Injectable({
  providedIn: 'root'
})
export  class  AuthService {
  private token: string;
  private userAuthenticated: boolean;
  private user: Users;
  private loginSubject: Subject<string>;
  constructor(private http: HttpClient, private router:Router) {
  }

  public userAuthListener: Subject<string>;



  getToken() {
    return this.token;
  }
  addUsers(user: {email: string , password: string, name: string, groupId: Number, profilePicId: Number }){
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
     this.saveAuth(token,expiresAt.toLocaleString(),res.user,values.username);
     this.router.navigate(['main']);
     } else {
       this.userAuthListener.next(' ');
     }
   });
 }

  private saveAuth(token: string, expiresAt: string, user: string, email: string){
    this.getUserDetails(email).subscribe(doc => {
      // console.log("inside saveauth",doc.users.length);
      localStorage.setItem('userName', doc.users[0].name);
      localStorage.setItem('userEmail',doc.users[0].email);
      localStorage.setItem('groupId', doc.users[0].groupId);
      localStorage.setItem('profilePicId', doc.users[0].profilePicId);
    });
    localStorage.setItem('token', token);
    localStorage.setItem('expiresAt', expiresAt.toString());
    localStorage.setItem('userLogged', user);
    // localStorage.setItem('userEmail', email);
  }

  logout(){
     this.router.navigate(['/home']);
  }

   getUsers() :Observable<any>{

    return this.http.get(env.apiUrl + '/auth/getUsers');

   }
  
  getUsersByGroupId(groupId: Number):Observable<Users>{
    return this.http.get<Users[]>(env.apiUrl + '/auth/getUsersByGroupId/' + groupId);
  }


  searchGroup(query: Number):Observable<Users>{
    return this.http.get<Users[]>(env.apiUrl + '/auth/searchGroup/' + query);
 }

 searchMaxGroupId():Observable<Users>
 {
   return this.http.get<Users>(env.apiUrl + '/auth/searchMaxGroupId');
 }

 getUserDetails(email: string):Observable<Users>{
   return this.http.get<Users[]>(env.apiUrl + '/auth/getUserDetails/' + email);
 }


}

