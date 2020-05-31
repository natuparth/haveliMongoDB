import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment as env} from '../../../environments/environment';
import { Users } from '../../../../backend/models/user';
import { Groups } from '../../../../backend/models/group';
@Injectable({
  providedIn: 'root'
})
export  class  AuthService {
  private token: string;
  private userAuthenticated: boolean;

  public nameSubject = new BehaviorSubject<string>(' ');
  public requestSubject = new BehaviorSubject<any[]>([]);
  constructor(private http: HttpClient, private router: Router) {
  }

  public userAuthListener: Subject<string>;
  getPendingRequests(email: string){
    return this.http.get<{doc: Array<Number>}>(env.apiUrl + '/auth/getPendingRequests/' + email);
  }

  changeRequestStatus(requestId: string, action: string, requestFor: string, groupId: Number){
    const reqBody = {
      requestId: requestId,
      action: action,
      requestFor: requestFor,
      groupId: groupId
    }
    return this.http.post<{message: string}>(env.apiUrl + '/auth/changeRequestStatus', reqBody);
  }

  getRequestObservable(){
    return this.requestSubject.asObservable();
  }
  getGroupsByName(name: String){
    return this.http.get<{groups: any}>(env.apiUrl + '/auth/getGroupsByName/' + name);

  }

  getGroupRequests(groupList: Array<string>){
    // console.log(groupList);
    const params = new HttpParams().set('groupList', groupList.join(','));
    return this.http.get<{requests: Array<any>, message: string}>(env.apiUrl + '/auth/getGroupRequests' , {params: params});
  }
  getGroupMembers(groupList: Array<Number>){
    // console.log(groupList);
   const params = new HttpParams().set('groupList', groupList.join(','));
    return this.http.get<{users: Array<any>, message: string}>(env.apiUrl + '/auth/getGroupMembers' , {params: params});
  }

  getGroups(email: string): Observable<{items: Array<any>, message: string}> {
    return this.http.get<{items: Array<any>, message: string}>(env.apiUrl + '/auth/getGroups/' + email);
  }

  addGroup(groupName: string){
    console.log(groupName);
    const groupObj = {
      userEmail: localStorage.getItem('userEmail'),
      groupName: groupName
    }
    return this.http.post(env.apiUrl + '/auth/addGroup', groupObj).subscribe(doc => {
      console.log(doc);
    });
  }
  getNameObservable(){
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
    if(groups.length>0){
      localStorage.setItem('groupId', groups[0].toString());
    }
  }

  logout() {
    localStorage.clear();
   this.router.navigate(['/home']);
  }

   getUsers(): Observable<any> {

    return this.http.get(env.apiUrl + '/auth/getUsers');

   }

  getUsersByGroupId(groupId: Number): Observable<Users> {
    return this.http.get<Users[]>(env.apiUrl + '/auth/getUsersByGroupId/' + groupId);
  }

  // getUsersByGroupId(groupId: Number): Observable<Users> {
  //   const params = new HttpParams().set('groupList', groupId.toString());
  //   return this.http.get<{users: Array<any>, message: string}>(env.apiUrl + '/auth/getGroupMembers' , {params: params});
  // }

  searchGroup(query: Number): Observable<Users> {
    return this.http.get<Users[]>(env.apiUrl + '/auth/searchGroup/' + query);
 }

 searchMaxGroupId(): Observable<Groups> {
   return this.http.get<Groups>(env.apiUrl + '/auth/searchMaxGroupId');
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

public updatePassword(user: any): Observable<any>{
  const userData :  Users = {
    email :  user.email,
    password : user.password
  };
  return this.http.put<{message: string}>(env.apiUrl + '/auth/updatePassword', userData);
}

public sendOtp(userData:any):Observable<any>{
  return this.http.post<any>(env.apiUrl + '/auth/sendOtp',userData);
}

public sendMessageByMail(userData:any):Observable<any>{
  return this.http.post<any>(env.apiUrl + '/auth/sendMessage',userData);
}

createRequest(reqBody: any){
   return this.http.post<{doc: Array<any>, message: String}>(env.apiUrl + '/auth/addRequest', reqBody);
}
}

