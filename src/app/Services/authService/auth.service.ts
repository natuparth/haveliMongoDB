import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment as env} from '../../../environments/environment';
import { Users } from '../../../../backend/models/user';
@Injectable({
  providedIn: 'root'
})
export  class  AuthService {
  private token: string;
  private userAuthenticated: boolean;

  public nameSubject = new BehaviorSubject(localStorage.getItem('userName'));

  constructor(private http: HttpClient, private router: Router) {
  }

  public userAuthListener: Subject<string>;

  getNameObservable(){
    return this.nameSubject.asObservable();
  }

  getToken() {
    return this.token;
  }

  addUsers(user: {email: string , password: string, name: string, groupId: string, profilePicId: Number }) {
    return this.http.post<{message: string}>(env.apiUrl + '/auth/addUser', user);
 }

 getUserAuthenticated() {
  return localStorage.getItem('userName') != null ? true : this.router.navigate(['login']) ;
 }

  getUserAuthListener() {
    return this.userAuthListener.asObservable();
  }
 login(values: any) {
   const authData = {
     email : values.username,
     password : values.password
   };
   console.log(authData);
   this.http.post<{token?: string, message: string, userName: string,
                    userEmail: string, groupId: string, profilePicId: string, expiresIn?: number}>
                    (env.apiUrl + '/auth/login', authData).subscribe(res => {
     const token = res.token;
     this.token = token;
     console.log(res.expiresIn);
     if (res.message === 'user signed in successfully') {
      this.userAuthenticated = true;
     const nowDate = new Date();
     const expiresAt = new Date(nowDate.getTime() + res.expiresIn * 1000);
     this.saveAuth(token, expiresAt.toLocaleString(), res.userName, res.groupId, res.profilePicId, res.userEmail);

     }
     this.userAuthListener.next(res.message);
   });
 }

  private saveAuth(token: string, expiresAt: string,  userName:  string, groupId: string, profilePicId: string, userEmail: string) {
    localStorage.setItem('userName', userName);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('groupId', groupId);
    localStorage.setItem('profilePicId', profilePicId);
    localStorage.setItem('token', token);
    localStorage.setItem('expiresAt', expiresAt.toString());
  }

  logout() {
    localStorage.clear();
   this.router.navigate(['/home']);
  }

   getUsers(): Observable<any> {

    return this.http.get(env.apiUrl + '/auth/getUsers');

   }

  getUsersByGroupId(groupId: String): Observable<Users> {
    return this.http.get<Users[]>(env.apiUrl + '/auth/getUsersByGroupId/' + groupId);
  }


  searchGroup(query: Number): Observable<Users> {
    return this.http.get<Users[]>(env.apiUrl + '/auth/searchGroup/' + query);
 }

 searchMaxGroupId(): Observable<Users> {
   return this.http.get<Users>(env.apiUrl + '/auth/searchMaxGroupId');
 }

 getUserDetails(email: string): Observable<Users> {
   return this.http.get<Users[]>(env.apiUrl + '/auth/getUserDetails/' + email);
 }

 checkEmailExists(email: string) {
   return this.http.get(env.apiUrl + '/auth/checkEmailExists/' + email);
}

public updateProfile(profile : any, email : string): Observable<any>{
  const profileData :  Users = {
    name : profile.name,
    email :  profile.email,
    password : profile.password,
    groupId : profile.groupId,
    profilePicId : profile.profilePicId
  };
  if(profile.updatePassword){
    return this.http.put<{message: string}>(env.apiUrl + '/auth/updateProfile/'+ email + '/' , profileData);
  }
  return this.http.put<{message: string}>(env.apiUrl + '/auth/updateProfileWithoutpassword/'+ email + '/' , profileData);
}


}

