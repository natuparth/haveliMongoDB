import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userEmail:  string = null;
  userName:  string = null;

  constructor() { }

  ngOnInit() {
    this.userEmail = localStorage.getItem('userEmail');
    this.userName = localStorage.getItem('userName');
  }

}
