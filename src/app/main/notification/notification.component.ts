import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/Services/authService/auth.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnChanges {
   @Input() notifications: Array<any> = [];
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
   ngOnChanges(changes: SimpleChanges) {
   this.notifications = changes.notifications.currentValue;
   }

   changeRequestStatus(requestId: string, action: string, requstFor: string, groupId: Number){
    if(confirm("Are you sure you want to accept the request")){
        this.authService.changeRequestStatus(requestId, action, requstFor, groupId).subscribe((doc) => {
          console.log(doc);

        })
    }
   }
}
