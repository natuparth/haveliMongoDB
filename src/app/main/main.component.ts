import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/authService/auth.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  user = ' ';
  userImg = ' ';
  userName = ' ';
  groupList: any[] = [];
  gid:string;
  showChildToggle:boolean=true;
  nameObservable: Observable<string>;
  constructor(private router: Router, private authService: AuthService,private route: ActivatedRoute) {
    console.log('main constructor called and added');
   // this.router.navigate(['main/grocery']);
    this.nameObservable = authService.getNameObservable();
    authService.nameSubject.next(localStorage.getItem('userName'));
  }

  logout(){
  this.authService.logout();
  }


  ngOnInit() {
    this.gid=localStorage.getItem('groupId');
    this.authService.getGroups(localStorage.getItem('userEmail')).subscribe((doc) => {
      this.groupList=doc.items;
     // console.log(doc);
     // console.log(this.groupList);

    });
    this.nameObservable.subscribe(name => {
      console.log('observable called');
      this.userName = name;
      this.user = name.split(' ')[0];
    this.userImg = '../assets/' + this.user.toLocaleLowerCase() + '.jpg';

    });
    //  this.user = localStorage.getItem('userName').split(' ')[0];
    // console.log(this.user);
    const a1 = new Date(localStorage.getItem('expiresAt')).getTime();
    const a2 = new Date().getTime();
    // console.log(a1);
    // console.log(a2);
    if(a1 < a2) {
        //  this.router.navigate(['home']);
      }


  }

  setGroup(groupId:string){
    localStorage.setItem('groupId',groupId)
    this.gid=localStorage.getItem('groupId');
        this.showChildToggle = false;
        setTimeout(() => {
        this.showChildToggle = true
        }, 100);
    
  }

}

