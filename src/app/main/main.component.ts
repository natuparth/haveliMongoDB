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
  notifications: Array<any> = [];
  nameObservable: Observable<string>;
  requestObservable: Observable<string[]>;
  requestDisplay = 'none';
  groupList: any[] = [];
  gid: string;
  showChildToggle = true;
  noOfNotificatons = 0;

  constructor(private router: Router, private authService: AuthService,private route: ActivatedRoute) {
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
    this.notifications = value;
    console.log('notifiaction',value.length);
    this.noOfNotificatons=value.length;
    })
    // this.gid=localStorage.getItem('groupId');
    this.authService.getGroups(localStorage.getItem('userEmail')).subscribe((doc) => {
      this.groupList=doc.items;
      if(this.groupList.length){
        this.gid=this.groupList.find(x => x.groupId == localStorage.getItem('groupId')).groupName;
      }
    });
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

  setGroup(group:any){
    localStorage.setItem('groupId',group.groupId)
    this.gid=group.groupName;
        this.showChildToggle = false;
        setTimeout(() => {
        this.showChildToggle = true
        }, 100);

  }

}

