import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../Services/authService/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  addFormFlag = false;
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  addGroup(groupName: string){
    this.authService.addGroup(groupName);
  }
  joinGroup(){

  }
  showAddForm(){
    this.addFormFlag = true;
  }

}
