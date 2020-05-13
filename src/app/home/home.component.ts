import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../Services/authService/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  addFormFlag = false;
  groupMap = new Map<Number, Group>();
  constructor(private router: Router, private authService: AuthService) { }
  groups: Group[] = [];
  ngOnInit() {
    this.authService.getGroups(localStorage.getItem('userEmail')).subscribe((doc) => {
      const size = doc.items.length;
      for (let i = 0; i < size; i++) {
        this.groupMap.set(doc.items[i].groupId, { name: doc.items[i].groupName, users: []});
      }
      this.authService.getGroupMembers([...this.groupMap.keys()]).subscribe((data) => {
        data.users.forEach((user) => {
          const usersArray = this.groupMap.get(user.groups).users;
          usersArray.push(user.name);
          this.groupMap.set(user.groups, Object.assign({...this.groupMap.get(user.groups)}, {users: usersArray}));
        });
      });
    });
  }

  addGroup(groupName: string){
    this.authService.addGroup(groupName);
  }
  joinGroup(groupId: Number){

  }
  showAddForm(){
    this.addFormFlag = true;
  }
  setFocusGroup(group:any){
    // console.log(group.key)
    localStorage.setItem('groupId', group.key.toString());
  }

}
interface Group{
  name: string;
  users: Array<any>;
}
