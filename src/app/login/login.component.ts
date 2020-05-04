import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/authService/auth.service';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/Services/crudService/crud.service';
import { Subject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  addDisplayBlankGroupId: String = 'none';
  addDisplayNewGroupId: String = 'none';
  loadingFlag: String = 'none';
  newGroupId: Number = null;
  searchForm: FormGroup;
  registerUserForm: FormGroup;
  isAuthenticated: boolean;
  message:String;
  login_flag:boolean;
  constructor( private authService: AuthService, private router: Router) {
    this.authService.userAuthListener = new Subject<string>();

  }

  ngOnInit() {
    if(localStorage.getItem('userName') != null && !localStorage.getItem('serverDown')) {
       this.router.navigate(['main/grocery']);
    }
   this.registerUserForm = new FormGroup({
    'name' : new FormControl('', Validators.required),
    'email' : new FormControl('', Validators.required),
    'password' : new FormControl('', Validators.required),
    'groupId' : new FormControl(''),
    'profilePicId' : new FormControl('')
  });
}
  validateCredentials(values: any){
    this.authService.login(values);
        this.authService.getUserAuthListener().subscribe((message) => {
      this.login_flag = false;
      if (message === 'user signed in successfully') {
             this.router.navigate(['main/grocery']);
      } else   {
        this.login_flag = true;
        this.message = message;

        }
    });
  }

  addUser(item: any) {
    // tslint:disable-next-line: triple-equals
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
      alert('new group created with group Id ' + this.newGroupId);
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
