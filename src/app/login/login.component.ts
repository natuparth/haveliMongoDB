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
    'password' : new FormControl('', Validators.required)
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
     this.authService.addUsers(item.value);
    //  // alert('item has been added successfully')
   }

}
