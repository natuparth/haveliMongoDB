import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authService/auth.service';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/crudService/crud.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { FormGroup,FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private username: string;
  private password: string;
  addDisplayBlankGroupId: String = 'none';
  addDisplayNewGroupId: String = 'none';
  loadingFlag: String = 'none';
  newGroupId: Number = null;
  searchForm: FormGroup;
  registerUserForm: FormGroup;
  public isAuthenticated: boolean;
  constructor(private crudService: CrudService, private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.authService.userAuthListener = new Subject<string>();

  }

  ngOnInit() {
   this.username = 'parth.natu';
   this.password = 'natunatu';
   this.registerUserForm = new FormGroup({
    'name' : new FormControl('', Validators.required),
    'email' : new FormControl('', Validators.required),
    'password' : new FormControl('', Validators.required),
    'groupId' : new FormControl('')
  });
  }
  validateCredentials(values: any){
    this.authService.login(values);
    this.authService.getUserAuthListener().subscribe((res) => {
      if (res !== ' ') {
        this.router.navigate(['main']);
      } else   {
        this.router.navigate(['login']);
      }
    });
  }

  addUser(item: any) {
    if(item.value.groupId=='')
    {
      this.addDisplayBlankGroupId = 'block';
    }
    else
    {
      this.authService.searchGroup(item.value.groupId).subscribe(doc => {
        if(doc.users.length == 0)
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
      this.newGroupId = doc.users[0].groupId + 1;
      alert("new group created with group Id "+this.newGroupId);
      this.loadingFlag = 'block';
      this.registerUserForm.value.groupId = this.newGroupId;
      this.authService.addUsers(this.registerUserForm.value).subscribe(res=>{
        alert(res.message);
        this.loadingFlag = 'none';
      });
    });
  }

  addUserNoGroupId()
  {
    console.log(this.loadingFlag);
    this.addDisplayBlankGroupId = 'none';
    alert("No Group Id is assigned you can update you profile later-"+this.loadingFlag);
    this.loadingFlag = 'block';
    console.log('after alert',this.loadingFlag);
    this.authService.addUsers(this.registerUserForm.value).subscribe(res=>{
      alert(res.message);
      this.loadingFlag = 'none';
    });
    
  }

}
