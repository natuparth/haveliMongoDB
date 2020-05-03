import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../Services/authService/auth.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  user = ' ';
  userImg = ' ';
  userName = '';
  subscription: Subscription;
  constructor(private router: Router, private authService: AuthService) {
    console.log('main constructor called and added');
    this.router.navigate(['main/grocery']);

  }

  logout(){

  this.authService.logout();
  }


  ngOnInit() {
    this.authService.getNameObservable().subscribe(name => {
      console.log('observable called');
      this.user = name.split(' ')[0];
    this.userImg = '../assets/' + this.user.toLocaleLowerCase() + '.jpg';

    });
      this.user = localStorage.getItem('userName').split(' ')[0];
     console.log(this.user);
    const a1 = new Date(localStorage.getItem('expiresAt')).getTime();
    const a2 = new Date().getTime();
    console.log(a1);
    console.log(a2);
    if(a1 < a2) {
         this.router.navigate(['home']);
      }

   /* this.authService.getUserAuthListener().subscribe((res) => {
      console.log('response is' + res);
      this.user = res;
    });*/
  }

}
