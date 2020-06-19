import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment as env} from '../../../environments/environment';
import { Users } from '../../../../backend/models/user';

@Injectable({
  providedIn: 'root'
})
export  class  AuthService {
  private token: string;
  private userAuthenticated;
  public nameSubject = new BehaviorSubject<string>(' ');
  constructor(private http: HttpClient, private router: Router) {
  }

  public userAuthListener: Subject<string>;

  getNameObservable() {
    return this.nameSubject.asObservable();
  }

  getToken() {
    return this.token;
  }

  addUsers(user: {email: string , password: string, name: string, groupId: Number, profilePicId: Number }) {
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
                    userEmail: string, groups: [Number], profilePicId: string, expiresIn?: number}>
                    (env.apiUrl + '/auth/login', authData).subscribe(res => {
     const token = res.token;
     this.token = token;
     console.log(res.expiresIn);
     if (res.message === 'user signed in successfully') {
      this.userAuthenticated = true;
     const nowDate = new Date();
     const expiresAt = new Date(nowDate.getTime() + res.expiresIn * 1000);
     this.saveAuth(token, expiresAt.toLocaleString(), res.userName, res.groups, res.profilePicId, res.userEmail);

     }
     localStorage.removeItem('serverDown');
     this.nameSubject.next(res.userName);
     this.userAuthListener.next(res.message);
   });
 }

  private saveAuth(token: string, expiresAt: string,  userName:  string, groups: [Number], profilePicId: string, userEmail: string) {
    localStorage.clear();
    localStorage.setItem('userName', userName);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('groups', groups.join(','));
    localStorage.setItem('profilePicId', profilePicId);
    localStorage.setItem('token', token);
    localStorage.setItem('expiresAt', expiresAt.toString());
    if (groups.length > 0) {
      localStorage.setItem('groupId', groups[0].toString());
    }
  }

  logout() {
    localStorage.clear();
   this.router.navigate(['/home']);
  }




 checkEmailExists(email: string) {
   return this.http.get(env.apiUrl + '/auth/checkEmailExists/' + email);
}

public updateProfile(profile: any, email: string): Observable<any> {
  const profileData:  Users = {
    name : profile.name,
    email :  profile.email,
    password : profile.password,
    groupId : profile.groupId,
    profilePicId : profile.profilePicId
  };
  if (profile.updatePassword) {
    return this.http.put<{message: string}>(env.apiUrl + '/auth/updateProfile/' + email + '/' , profileData);
  }
  return this.http.put<{message: string}>(env.apiUrl + '/auth/updateProfileWithoutpassword/' + email + '/' , profileData);
}

public updatePassword(user: any): Observable<any> {
  const userData:  Users = {
    email :  user.email,
    password : user.password
  };
  return this.http.put<{message: string}>(env.apiUrl + '/auth/updatePassword', userData);
}

public sendOtp(userData: any): Observable<any> {
  return this.http.post<any>(env.apiUrl + '/auth/sendOtp', userData);
}

public sendMessageByMail(userData: any): Observable<any> {
  return this.http.post<any>(env.apiUrl + '/auth/sendMessage', userData);
}

}

