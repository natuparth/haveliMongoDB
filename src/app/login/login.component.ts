import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/authService/auth.service';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/Services/crudService/crud.service';
import { Subject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HostListener } from "@angular/core";
import { GroupService } from '../Services/groupService/group.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loadingFlag: boolean = false;
  newGroupId: Number = null;
  searchForm: FormGroup;
  isAuthenticated: boolean;
  message:String='';
  login_flag:boolean;
  in_min = [0, 0];
  in_max = [0, 0];
  out_min = [-50,-40];
  out_max = [50,40];
  rotateAnimationValue = [0,0,0,0,0,0];
  screenHeight: number;
  screenWidth: number;
  otpCheckForm: FormGroup;
  currentOtp: string = '';
  resendOtpFlag:boolean = false;
  forgotPasswordFlag: boolean = false;
  updatePasswordFlag: boolean = false;
  constructor( private authService: AuthService, private router: Router,private groupService:GroupService) {
    this.authService.userAuthListener = new Subject<string>();
  }
  ngOnInit() {
    if(localStorage.getItem('token') != null){
    if(new Date(localStorage.getItem('expiresAt'))> new Date(Date.now())){
      localStorage.clear();
      this.message = "your authentication has expired"
    }
    else
    this.router.navigate(['main/home']);
  }
    this.getScreenSize();
    this.otpCheckForm = new FormGroup({
      'email' : new FormControl('', Validators.required),
      'otp' : new FormControl(''),
      'password' : new FormControl('')
    });
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

  sendOtpByMail(){
    this.loadingFlag = true;

    if(this.otpCheckForm.value.email !== ''){
      this.authService.checkEmailExists(this.otpCheckForm.value.email).subscribe(value => {
        if(value === true){
          this.currentOtp = this.generateOtp();
          const userdata = {
            email:this.otpCheckForm.value.email,
            subject: 'Restore your account',
            message:  'Your OTP to restore '+this.otpCheckForm.value.email+' is '+this.currentOtp
          }
          this.authService.sendMessageByMail(userdata).subscribe((doc)=>{
            // console.log(doc.message);
            if(doc.message=='Mail sent successfully'){
              this.resendOtpFlag = true;
            }
            else{
              alert("Coud not send OTP!!!! \nPlease check the email and try again.")
            }
            this.loadingFlag = false;
          });
        }
        else{
          this.otpCheckForm.controls['email'].setErrors({'alreadyDoesNotExists': true});
          this.loadingFlag = false;
        }
      });
    } 
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
    // console.log('OTP matched called');this.currentOtp == this.otpCheckForm.value.otp
    if(true){
      this.resendOtpFlag=false;
      alert("Correct OTP");
      this.updatePasswordFlag = true;
    }
    else{
      alert("INVALID OTP");
    }
  }

  resendOtp(){
    // console.log('resend OTP called');
    if(confirm("Do you want to resent OTP??")){
      this.sendOtpByMail();
    }
  }

  updatePassword(){
    if(this.otpCheckForm.value.password==''){
      alert('Password cannot be blank');
    }
    else{
      const userdata = {
        email:this.otpCheckForm.value.email,
        password:this.otpCheckForm.value.password
      }
      this.authService.updatePassword(userdata).subscribe(response =>{
        if(response.message === 'successfully updated'){
          alert('Password successfully updated');
          this.forgotPasswordFlag=false;
          this.resendOtpFlag = false;
          this.updatePasswordFlag = false;
        } else{
          alert('some error occurred while adding the expense. Error: ' +
          response.error)
        }
      });
    }
  }

  @HostListener('mousemove', ['$event'])onhover(e?){
    let cursoPosX = (e.pageX+1)-this.screenWidth/2;
    let cursoPosY = (e.pageY+1)-this.screenHeight/2;
    this.rotateAnimationValue[0]= Math.round((cursoPosX - this.in_min[0]) * (this.out_max[0] - this.out_min[0]) / (this.in_max[0] - this.in_min[0]) + this.out_min[0]);
    this.rotateAnimationValue[1]= Math.round((cursoPosY - this.in_min[1]) * (this.out_max[0] - this.out_min[0]) / (this.in_max[1] - this.in_min[1]) + this.out_min[0]);
    this.rotateAnimationValue[2]= Math.round((cursoPosX - this.in_min[0]) * (this.out_max[1] - this.out_min[0]) / (this.in_max[0] - this.in_min[0]) + this.out_min[1]);
    this.rotateAnimationValue[3]= Math.round((cursoPosY - this.in_min[1]) * (this.out_max[1] - this.out_min[0]) / (this.in_max[1] - this.in_min[1]) + this.out_min[1]);
    this.rotateAnimationValue[4]= ((cursoPosX - this.in_min[1]) * (-2 - 2) / (this.in_max[1] - this.in_min[1]) + 2);
    this.rotateAnimationValue[5]= ((cursoPosY - this.in_min[1]) * (-2 - 2) / (this.in_max[1] - this.in_min[1]) + 2);
    // console.log(this.rotateAnimationValue);
  }

  
  @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
          this.screenHeight = window.innerHeight;
          this.screenWidth = window.innerWidth;
          this.in_min = [0-this.screenWidth/2 , 0-this.screenHeight/2];
          this.in_max = [this.screenWidth/2 , this.screenHeight/2];
          // console.log(this.screenHeight, this.screenWidth);
    }
}
