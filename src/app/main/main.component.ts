import { Component, OnInit, ViewChild, AfterViewChecked, QueryList, AfterViewInit, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/authService/auth.service';
import { HomeComponent } from '../home/home.component';
import { GroceryComponent } from '../main/grocery/grocery.component';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  user = ' ';
  userImg = ' ';
  userName = ' ';
  notifications: Array<any> = [];
  nameObservable: Observable<string>;
  requestObservable: Observable<string[]>;
  requestDisplay = 'none';
  constructor(private router: Router, private authService: AuthService) {
    console.log('main constructor called and added');
   // this.router.navigate(['main/grocery']);
    this.nameObservable = authService.getNameObservable();
    authService.nameSubject.next(localStorage.getItem('userName'));
    this.requestObservable = authService.getRequestObservable();
  }

  logout(){
  this.authService.logout();
  }


  ngOnInit() {
    this.requestObservable.subscribe(value => {
     // this.requests = value;
    this.notifications = value;
     console.log(value);
    })
    this.nameObservable.subscribe(name => {
      console.log('observable called');
      this.userName = name;
      this.user = name.split(' ')[0];
    this.userImg = '../assets/' + this.user.toLocaleLowerCase() + '.jpg';

    });
    const a1 = new Date(localStorage.getItem('expiresAt')).getTime();
    const a2 = new Date().getTime();
    if(a1 < a2) {
        //  this.router.navigate(['home']);
      }
  }
  openNotification(){
   this.requestDisplay = this.requestDisplay === 'block' ? 'none' : 'block';
  }

}
