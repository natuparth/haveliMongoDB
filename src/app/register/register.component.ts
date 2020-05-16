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
  otpCheck: FormGroup;
  loadingFlag: boolean = false;
  registerFormToggle:boolean = true;
  currentOtp = '';
  resendOtpFlag:boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.registerUserForm = new FormGroup({
      'name' : new FormControl('', Validators.required),
      'email' : new FormControl('', [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]),
      'password' : new FormControl('', Validators.required),
      'groupId' : new FormControl(''),
      'profilePicId' : new FormControl('')
    });
    this.otpCheck = new FormGroup({
      'otp' : new FormControl('')//add required when merged
    });
  }

  addUser(item: any) {
    // console.log('add user',item);
    this.loadingFlag = true;
    this.authService.addUsers(item.value).subscribe(res => {
      alert(res.message);
      this.loadingFlag = false;
    });
  }

  sendOtpByMail(){
    this.loadingFlag = true;
    // console.log('send OTP called');
    this.currentOtp = this.generateOtp();
    const userdata = {
      email:this.registerUserForm.value.email,
      otp:this.currentOtp,
      name:this.registerUserForm.value.name
    }
    this.authService.sendOtp(userdata).subscribe((doc)=>{
      if(doc.message=='Mail sent successfully'){
        this.registerFormToggle = !this.registerFormToggle;
        this.resendOtpFlag = true;
      }
      else{
        alert("Coud not send OTP!!!! \nPlease check the email and try again.")
      }
      this.loadingFlag = false;
    });
  }

  generateOtp(){
    // console.log('generate OTP called');
    let charsList ='0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ'.split('');
    let randomOtp = '';
    let maxindex = charsList.length-1;
    for(let i=0;i<6;i++){
      let randomNo = Math.floor(Math.random() * (maxindex - 0 + 1));
      randomOtp += charsList[randomNo];
    }
    return randomOtp;
  }

  checkOtp(){
    // console.log('OTP matched called');
    // if(this.currentOtp == this.otpCheck.value.otp)
    if(true)
    {
      // console.log('OTP Matched');
      this.addUser(this.registerUserForm);
    }
    else{
      alert("INVALID OTP!!!!1");
    }
  }

  resendOtp(){
    // console.log('resend OTP called');
    if(confirm("Do you want to resent OTP??")){
      this.sendOtpByMail();
    }
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
