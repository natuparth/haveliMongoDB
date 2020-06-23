import { Component, OnInit } from '@angular/core';
import { ExpenseService } from 'src/app/Services/expenseService/expense-service.service';
import { CrudService } from 'src/app/Services/crudService/crud.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  expHistory:any=[];
  itemSubject = new Subject<any>();
  errMessage:String;
  errFlag:boolean=false;
  constructor(private expenseService: ExpenseService,private crudService:CrudService) { }

  ngOnInit() {
    this.itemSubject.subscribe(doc => {
      console.log( doc)
      if(doc.length!=undefined)
      this.expHistory = doc.reverse();
      else
      this.expHistory=doc;
    });
    this.expenseService.getExpenseHistory(Number(localStorage.getItem('groupId'))).subscribe(doc => {
      
      this.itemSubject.next(doc);
     if (this.crudService.getItemListKey(this.expHistory) !='') {
        this.errMessage = this.crudService.getItemListKey(this.expHistory);
        this.errFlag = true;
     }
     
    });
  }

}
