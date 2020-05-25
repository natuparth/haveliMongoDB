import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit,OnChanges {
  @Input() requestDisplay = 'none';
   @Input() notifications: Array<any> = [];
  constructor() { }

  ngOnInit() {
  }
   ngOnChanges(changes: SimpleChanges){
     console.log(changes);
     this.requestDisplay = changes.requestDisplay.currentValue;
   }
}
