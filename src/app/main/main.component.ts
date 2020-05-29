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
    this.nameObservable = authService.getNameObservable();
    authService.nameSubject.next(localStorage.getItem('userName'));
    this.requestObservable = authService.getRequestObservable();
  }

  logout(){
  this.authService.logout();
  }


  ngOnInit() {
    this.authService.getGroups(localStorage.getItem('userEmail')).subscribe((doc) => {
      this.groupList=doc.items;
      if(this.groupList.length){
        this.gid=this.groupList.find(x => x.groupId == localStorage.getItem('groupId')).groupName;
        this.getNotifications();
      }
    });
    this.nameObservable.subscribe(name => {
      this.userName = name;
      this.user = name.split(' ')[0];
    });
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
  getNotifications(){
    this.authService.getGroupRequests(localStorage.getItem('groups').split(',')).subscribe((data) => {
      this.notifications = data.requests;
      this.noOfNotificatons=this.notifications.length;
      this.notifications.map((request) => {
        request.groupName=this.groupList.find(x => x.groupId == request.groupId).groupName;
      });
      this.authService.requestSubject.next(this.notifications);
    });
  }
}

