import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment as env} from '../../../environments/environment';
import { Users } from '../../../../backend/models/user';


@Injectable({
  providedIn: 'root'
})

export class GroupService {
  public requestSubject = new BehaviorSubject<any[]>([]);
  constructor(private http: HttpClient, private router: Router) {
  }


  getPendingRequests(email: string) {
    return this.http.get<{doc: Array<Number>}>(env.apiUrl + '/group/getPendingRequests/' + email);
  }

  changeRequestStatus(requestId: string, action: string, requestFor: string, groupId: Number) {
    const reqBody = {
      requestId: requestId,
      action: action,
      requestFor: requestFor,
      groupId: groupId
    };
    return this.http.post<{message: string}>(env.apiUrl + '/group/changeRequestStatus', reqBody);
  }

  getRequestObservable() {
    return this.requestSubject.asObservable();
  }
  getGroupsByName(name: String) {
    return this.http.get<{groups: any}>(env.apiUrl + '/group/getGroupsByName/' + name);

  }

  getGroupRequests(groupList: Array<string>) {
    const params = new HttpParams().set('groupList', groupList.join(','));
    return this.http.get<{requests: Array<any>, message: string}>(env.apiUrl + '/group/getGroupRequests' , {params: params});
  }
  getGroupMembers(groupList: Array<Number>) {
   const params = new HttpParams().set('groupList', groupList.join(','));
    return this.http.get<{users: Array<any>, message: string}>(env.apiUrl + '/group/getGroupMembers' , {params: params});
  }

  //getGroupMembersExpense
  getGroupMembersExpense(groupId: string) {
    const params = new HttpParams().set('groupId', groupId);
     return this.http.get<any>(env.apiUrl + '/group/getGroupMembersExpense' , {params: params});
   }

  getGroups(email: string): Observable<{items: Array<any>, message: string}> {
    return this.http.get<{items: Array<any>, message: string}>(env.apiUrl + '/group/getGroups/' + email);
  }

  addGroup(groupName: string) {
    console.log(groupName);
    const groupObj = {
      userEmail: localStorage.getItem('userEmail'),
      groupName: groupName
    };
    return this.http.post(env.apiUrl + '/group/addGroup', groupObj).subscribe(doc => {
      console.log(doc);
    });
  }


  getUsersByGroupId(groupId: Number): Observable<Users> {
    return this.http.get<Users[]>(env.apiUrl + '/group/getUsersByGroupId/' + groupId);
  }


  searchGroup(query: Number): Observable<Users> {
    return this.http.get<Users[]>(env.apiUrl + '/group/searchGroup/' + query);
 }



createRequest(reqBody: any) {
  return this.http.post<{doc: Array<any>, message: String}>(env.apiUrl + '/group/addRequest', reqBody);
}











}
