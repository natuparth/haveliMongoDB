import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/authService/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  
  userData: FormGroup;
  userEmail:  string = null;
  userName:  string = null;
  updateProfileDisplay: boolean = false;
  updatePofileForm: FormGroup;
  loadingFlad: boolean = false;

  constructor(private authService: AuthService) { }

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
  }

  getProfileData(){
    this.authService.getUserDetails(this.userEmail).subscribe(doc => {
      console.log(doc.users.length,this.userEmail)
      doc.users.forEach(user => {
        this.userData.value.name = user.name;
        this.userData.value.email = user.email;
        this.userData.value.password = user.password;
        this.userData.value.groupId = user.groupId;
        this.userData.value.profilePicId = user.profilePicId;
      });
      console.log(this.userData.value)
    });
  }

  updateProfileclose(){
    this.updateProfileDisplay = false;
  }

  updateProfileOpen(){
    this.updatePofileForm = new FormGroup({
      'name' : new FormControl(this.userData.value.name,Validators.required),
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
    this.authService.updateProfile(profile,profiledata.value.email).subscribe(response =>{
      if(response.message === 'successfully updated'){
        alert('Profile successfully updated');
      } else{
        alert('some error occurred while adding the expense. Error: ' +
        response.error)
      }
      this.getProfileData();
      this.loadingFlad = false;
      this.updateProfileclose();
    });
  }

}
