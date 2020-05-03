import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from '../Services/authService/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  user = ' ';
  userImg = ' ';
  userName: string = '';
  subscription: Subscription;
  constructor(private router: Router, private authService: AuthService) {
    console.log('main constructor called and added');
    
  this.subscription = router.events.subscribe((event) => {
    if (event instanceof NavigationStart) {
     //  browserRefresh = !router.navigated;
    }
});

    // this.router.navigate(['main/grocery']);
    this.router.navigate(['main/register']);
  }

  logout(){
   
  this.authService.logout(); 
  }


  ngOnInit() {

   // console.log(localStorage.getItem('expiresAt'));
    this.user = localStorage.getItem('userLogged');
    this.userName = localStorage.getItem('userName');
    this.userImg = '../assets/' + this.user.split(' ')[0].toLocaleLowerCase() + '.jpg';
    const a1 = new Date(localStorage.getItem('expiresAt')).getTime();
    const a2 = new Date().getTime();
    // console.log(a1);
    // console.log(a2);
    if(a1 < a2) {
        //  this.router.navigate(['home']);
      }

   /* this.authService.getUserAuthListener().subscribe((res) => {
      console.log('response is' + res);
      this.user = res;
    });*/
  }

}
