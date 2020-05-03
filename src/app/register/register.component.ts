import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../Services/authService/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerUserForm: FormGroup;
  addDisplayBlankGroupId: String = 'none';
  addDisplayNewGroupId: String = 'none';
  loadingFlag: String = 'none';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.registerUserForm = new FormGroup({
      'name' : new FormControl('', Validators.required),
      'email' : new FormControl('', Validators.required),
      'password' : new FormControl('', Validators.required),
      'groupId' : new FormControl(''),
      'profilePicId' : new FormControl('')
    });
  }

  addUser(item: any) {
    console.log('add user',item)
    if (item.value.groupId == '')
    {
      this.addDisplayBlankGroupId = 'block';
    }
    else
    {
      this.authService.searchGroup(item.value.groupId).subscribe(value => {
        if (value.numberOfUsers === 0)
        {
          this.addDisplayNewGroupId = 'block';
        }
        else{
          console.log('adduserserice call')
          this.authService.addUsers(item);
        }
      });
    }
  }

  onCloseHandled(modalName: String) {
    this.addDisplayNewGroupId = 'none';
  }

  onCloseHandled1(modalName: String) {
    this.addDisplayBlankGroupId = 'none';
  }

  addUserWithNewGroup()
  {
    this.addDisplayNewGroupId = 'none';
    this.addDisplayBlankGroupId = 'none';
    this.loadingFlag = 'block';
    this.authService.searchMaxGroupId().subscribe(doc => {
      alert('new group created with group Id ' + this.registerUserForm.value.groupId);
    this.loadingFlag = 'block';
    this.authService.addUsers(this.registerUserForm.value).subscribe( res => {
    this.loadingFlag = 'none';
      });
    });
  }

  addUserNoGroupId()
  {
    this.addDisplayBlankGroupId = 'none';
    this.loadingFlag = 'block';
    alert('No Group Id is assigned you can update you profile later');
    this.authService.addUsers(this.registerUserForm.value).subscribe(res => {
      alert(res.message);
      this.loadingFlag = 'none';
    });

  }

  logform(email: string){
    if(email !== ''){
    this.authService.checkEmailExists(email).subscribe(value => {
      if(value === true){
       this.registerUserForm.controls['email'].setErrors({'alreadyExists': true});
      }
    });
  }

}

}
