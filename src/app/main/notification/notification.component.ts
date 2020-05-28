import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/Services/authService/auth.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnChanges {
   @Input() notifications: Array<any> = [];
   requestArea = true;
   notificationArea = false;
   openRequestNumber = -1;
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
   ngOnChanges(changes: SimpleChanges) {
   this.notifications = changes.notifications.currentValue;
   }

  onRequestOpen(){
    this.requestArea = true;
    this.notificationArea = false;
  }

  onNotificationOpen(){
    this.requestArea = false;
    this.notificationArea = true;
  }

   changeRequestStatus(requestId: string, action: string, requstFor: string, groupId: Number){
    if(confirm("Are you sure you want to accept the request")){
        this.authService.changeRequestStatus(requestId, action, requstFor, groupId).subscribe((doc) => {
          console.log(doc);

        })
    }
   }
  openRequest(requestNo:Number){
    // console.log('request no called'+requestNo);
    if(this.openRequestNumber == +requestNo){
      this.openRequestNumber = -1;
    }
    else{
      this.openRequestNumber = +requestNo;
    }
  }
}
