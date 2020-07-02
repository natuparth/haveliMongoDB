import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { GroupService } from '../Services/groupService/group.service';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  display = 'none';
  addFormFlag = false;
  requestList: Array<any> = [];
  requestedUser: String;
  pendingRequestGroupIds: Array<Number>;
  constructor(private router: Router, private groupService: GroupService) { }
  groups: Group[] = [];
  groupUsersList: String[] = [];
  searchGroupForm = new FormGroup({
    search: new FormControl('')
  });
  groupList: Group[] = [];
  userGroupList: any[] = [];
  groupIds = localStorage.getItem('groups').split(',');
  expandedIndex = -1 ;
  ngOnInit() {
    this.registerSearchGroup();
    this.groupService.getPendingRequests(localStorage.getItem('userEmail')).subscribe((groupIds) => {
       console.log(groupIds.doc);
      this.pendingRequestGroupIds = groupIds.doc;
    });
    this.groupService.getGroups(localStorage.getItem('userEmail')).subscribe( (doc)=> {
      this.userGroupList = doc.items;
    });
  }

  addGroup(groupName: string) {
    this.groupService.addGroup(groupName);
  }
  joinGroup() {
  this.display = 'block';
  }
  showAddForm() {
    this.addFormFlag = true;
  }
  setFocusGroup(group: any) {
    localStorage.setItem('groupId', group.key.toString());
  }
  registerSearchGroup() {
    this.searchGroupForm.controls.search.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      map(value => {
        return this.groupService.getGroupsByName(value);
      })
    ).subscribe((groups) => {
      this.groupList = [];
     groups.subscribe(value => {
      this.groupList = value.groups;
     });
    });
  }

  fetchUsers(groupId: number) {
    this.expandedIndex = groupId === this.expandedIndex ? -1 : groupId;
    this.groupUsersList = [];
    this.groupService.getUsersByGroupId(groupId).subscribe(value => {
      this.groupUsersList = value.users;
    });
  }

  onSelectionChange(email: String) {
    this.requestedUser = email;
  }

  sendRequest(groupName: String) {
    const reqBody = {
      for: localStorage.getItem('userEmail'),
      groupId: this.expandedIndex
    };
   this.groupService.createRequest(reqBody).subscribe(val => {
     if (val.message === 'request successful') {
       alert('you have successfully requested to be a part of the group' + groupName );
     }
   });

  }
 closeGroupModal() {
  this.display = 'none';

 }


 checkButton(groupId: Number) {
   if (this.groupIds.includes(groupId.toString())) {
     return 1;
   } else if (this.pendingRequestGroupIds.includes(groupId)) {
     return 2;
   } else {
     return 3;
   }
 }
}
interface Group {
  name: string;
  users: Array<any>;
}
