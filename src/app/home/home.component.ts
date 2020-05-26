import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../Services/authService/auth.service';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  display = 'none';
  addFormFlag = false;
  groupMap = new Map<Number, Group>();
  requestList: Array<any> = [];
  requestedUser: String;
  constructor(private router: Router, private authService: AuthService) { }
  groups: Group[] = [];
  groupUsersList: String[] = [];
  searchGroupForm = new FormGroup({
    search: new FormControl('')
  })
  groupList: Group[] = [];
  expandedIndex = -1 ;
  ngOnInit() {
    this.registerSearchGroup();
    this.authService.getGroups(localStorage.getItem('userEmail')).subscribe((doc) => {

      const size = doc.items.length;
      for (let i = 0; i < size; i++) {
        this.groupMap.set(doc.items[i].groupId, { name: doc.items[i].groupName, users: []});
      }
      this.authService.getGroupMembers([...this.groupMap.keys()]).subscribe((data) => {
          console.log(this.groupMap);
          console.log(data.users);
        data.users.forEach((user) => {
          console.log(user.groups);
          console.log(this.groupMap.get(user.groups));
          const usersArray = this.groupMap.get(user.groups).users;
          usersArray.push(user.name);
          this.groupMap.set(user.groups, Object.assign({...this.groupMap.get(user.groups)}, {users: usersArray}));

        });
        this.authService.getGroupRequests([...this.groupMap.keys()]).subscribe((data) => {
          this.requestList = data.requests;
          this.requestList.map((request) => {
            request.groupName = this.groupMap.get(request.groupId).name;
          })
          this.authService.requestSubject.next(this.requestList);
        })
      });

      //Request for fetching the group requests for a user




    });
  }

  addGroup(groupName: string){
    console.log('add group',groupName);
    this.authService.addGroup(groupName);
  }
  joinGroup(){
  this.display = 'block';
  }
  showAddForm(){
    this.addFormFlag = true;
  }
  setFocusGroup(group:any){
    // console.log(group.key)
    localStorage.setItem('groupId', group.key.toString());
  }
  registerSearchGroup(){
    this.searchGroupForm.controls.search.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
     map(value => {
       return this.authService.getGroupsByName(value);
     }
    )
    ).subscribe((groups) => {
      this.groupList = [];
     groups.subscribe(value => {
      console.log(value.groups);
      this.groupList = value.groups;
     })
    })


  }

  fetchUsers(groupId: number){
    this.expandedIndex = groupId === this.expandedIndex ? -1 : groupId;
    this.groupUsersList = [];
    this.authService.getUsersByGroupId(groupId).subscribe(value => {
      this.groupUsersList = value.users;
      console.log(value);
    })
  }

  onSelectionChange(email: String){
    this.requestedUser = email;
  }

  sendRequest(groupName: String){
    const reqBody = {
      for: localStorage.getItem('userEmail'),
      groupId: this.expandedIndex
    };
   this.authService.createRequest(reqBody).subscribe(val => {
     if(val.message === "request successful"){
       alert('you have successfully requested to be a part of the group' + groupName );
     }
   })
  }
 closeGroupModal(){
  this.display = 'none'

 }
}
interface Group{
  name: string;
  users: Array<any>;
}
