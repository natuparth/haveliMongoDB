import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/authService/auth.service';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/Services/crudService/crud.service';
import { Subject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HostListener } from "@angular/core";

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
  in_min = [0, 0];
  in_max = [0, 0];
  out_min = [-50,-40];
  out_max = [50,40];
  rotateAnimationValue = [0,0,0,0,0,0];
  screenHeight: number;
  screenWidth: number;
  constructor( private authService: AuthService, private router: Router) {
    this.authService.userAuthListener = new Subject<string>();

  }

  ngOnInit() {
    if(localStorage.getItem('userName') != null && localStorage.getItem('serverDown')!=null) {
       this.router.navigate(['home']);
    }
    this.getScreenSize();
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
