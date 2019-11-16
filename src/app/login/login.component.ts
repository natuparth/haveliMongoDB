import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private username: string;
  private password: string;
  public isAuthenticated: boolean;
  constructor(private authService: AuthService, private router: Router) {
    this.authService.userAuthListener = new Subject<string>();

  }

  ngOnInit() {
   this.username = 'parth.natu';
   this.password = 'natunatu';
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

}
