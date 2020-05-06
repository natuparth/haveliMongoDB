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
  loadingFlag: String = 'none';
  newGroupId: Number = null;
  searchForm: FormGroup;
  isAuthenticated: boolean;
  message:String;
  login_flag:boolean;
  constructor( private authService: AuthService, private router: Router) {
    this.authService.userAuthListener = new Subject<string>();

  }

  ngOnInit() {
    if(localStorage.getItem('userName') != null && localStorage.getItem('serverDown')!=null) {
       this.router.navigate(['home']);
    }
  }
  validateCredentials(values: any){
    this.authService.login(values);
        this.authService.getUserAuthListener().subscribe((message) => {
      this.login_flag = false;
      if (message === 'user signed in successfully') {
             this.router.navigate(['main/home']);
      } else   {
        this.login_flag = true;
        this.message = message;

        }
    });
  }

}
