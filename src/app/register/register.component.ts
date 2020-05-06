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
  loadingFlag: String = 'none';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.registerUserForm = new FormGroup({
      'name' : new FormControl('', Validators.required),
      'email' : new FormControl('', [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]),
      'password' : new FormControl('', Validators.required),
      'groupId' : new FormControl(''),
      'profilePicId' : new FormControl('')
    });
  }

  addUser(item: any) {
    console.log('add user',item);
    this.authService.addUsers(item.value).subscribe(res => {
      alert(res.message);
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
