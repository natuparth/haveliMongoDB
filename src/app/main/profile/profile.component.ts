import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/authService/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { GroupService } from 'src/app/Services/groupService/group.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  groupMap = new Map<Number, Group>();
  requestList: Array<any> = [];
  userData: FormGroup;
  userEmail:  string = null;
  userName:  string = null;
  updateProfileDisplay = false;
  updatePofileForm: FormGroup;
  loadingFlad = false;
  nameObservable: Observable<string>;

  constructor(private authService: AuthService, private groupService: GroupService) {

  }

  ngOnInit() {
    this.userData = new FormGroup({
      'name' : new FormControl('', Validators.required),
      'email' : new FormControl('', Validators.required),
      'password' : new FormControl('', Validators.required),
      'groupId' : new FormControl(''),
      'profilePicId' : new FormControl('')
    });
    this.userEmail = localStorage.getItem('userEmail');
    this.userName = localStorage.getItem('userName');
    this.getProfileData();
    this.getGroupData();
  }

  getProfileData() {
    this.authService.getUserDetails(this.userEmail).subscribe(doc => {
      console.log(doc.users.length, this.userEmail);
      doc.users.forEach(user => {
        this.userData.value.name = user.name;
        this.userData.value.email = user.email;
        this.userData.value.password = user.password;
        this.userData.value.groupId = localStorage.getItem('groupId');
        this.userData.value.profilePicId = user.profilePicId;
      });
      console.log(this.userData.value);
      this.userName = this.userData.value.name;
      this.authService.nameSubject.next(this.userName);
      localStorage.setItem('userName', this.userName);
    });
  }

  updateProfileclose() {
    this.updateProfileDisplay = false;
  }

  updateProfileOpen() {
    this.updatePofileForm = new FormGroup({
      'name' : new FormControl(this.userData.value.name, Validators.required),
      'email': new FormControl(this.userData.value.email, Validators.required),
      'password': new FormControl('', Validators.required),
      'groupId': new FormControl(this.userData.value.groupId),
      'profilePicId' : new FormControl(this.userData.value.profilePicId),
      'updatePassword': new FormControl(false)
    });
    this.updateProfileDisplay = true;
  }

  updateProfile(profiledata: FormControl) {
    this.loadingFlad = true;
    const profile = {
      name: profiledata.value.name,
      email: profiledata.value.email,
      password: profiledata.value.password,
      groupId: profiledata.value.groupId,
      profilePicId : profiledata.value.profilePicId,
      updatePassword : profiledata.value.updatePassword
    };
    this.authService.updateProfile(profile, profiledata.value.email).subscribe(response => {
      if (response.message === 'successfully updated') {
        alert('Profile successfully updated');

      } else {
        alert('some error occurred while adding the expense. Error: ' +
        response.error);
      }
      this.getProfileData();
      this.loadingFlad = false;
      this.updateProfileclose();
    });
  }

  getGroupData() {
    this.groupService.getGroups(localStorage.getItem('userEmail')).subscribe((doc) => {

      const size = doc.items.length;
      for (let i = 0; i < size; i++) {
        this.groupMap.set(doc.items[i].groupId, { name: doc.items[i].groupName, users: []});
      }
      this.groupService.getGroupMembers([...this.groupMap.keys()]).subscribe((data) => {

          data.users.forEach((user) => {
          const usersArray = this.groupMap.get(user.groups).users;
          usersArray.push(user.name);
          this.groupMap.set(user.groups, Object.assign({...this.groupMap.get(user.groups)}, {users: usersArray}));

        });
      });
    });
  }

}
interface Group {
  name: string;
  users: Array<any>;
}
