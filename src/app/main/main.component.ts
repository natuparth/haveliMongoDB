import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  user = ' ';
  constructor(private router: Router, private authService: AuthService) {
    console.log('main constructor called and added');
  this.authService.getUserAuthListener().subscribe((res) => {
    console.log('response is' + res);
    this.user = res;
  });

    this.router.navigate(['main/grocery']);
  }

  ngOnInit() {
  }

}
