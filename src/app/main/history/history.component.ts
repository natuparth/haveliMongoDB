import { Component, OnInit } from '@angular/core';
import { ExpenseService } from 'src/app/Services/expenseService/expense-service.service';
import { CrudService } from 'src/app/Services/crudService/crud.service';
import { Subject } from 'rxjs';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import * as _ from 'underscore';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  expHistory:any=[];
  filterExpHistory:any=[];
  itemSubject = new Subject<any>();
  errMessage:String;
  errFlag:boolean=false;
  dateFilterForm: FormGroup;
  pager: any = {};
  constructor(private expenseService: ExpenseService,private crudService:CrudService) { }

  ngOnInit() {
    this.itemSubject.subscribe(doc => {
      console.log( doc)
      if(doc.length!=undefined)
      this.expHistory = doc.reverse();
      else
      this.expHistory=doc;
      this.filterExpHistory=this.expHistory
      this.setPage(1);
    });
    this.expenseService.getExpenseHistory(Number(localStorage.getItem('groupId'))).subscribe(doc => {
      
      this.itemSubject.next(doc);
     if (this.crudService.getItemListKey(this.expHistory) !='') {
        this.errMessage = this.crudService.getItemListKey(this.expHistory);
        this.errFlag = true;
     }
     
    });
    this.dateFilterForm = new FormGroup({
      'dateStart': new FormControl(new Date, Validators.required),
      'dateEnd': new FormControl(new Date, Validators.required)
    })
  }
  chooseCustomDate(){
    let dateStart = new Date(this.dateFilterForm.value.dateStart);
    let dateEnd = new Date(this.dateFilterForm.value.dateEnd);
    this.filterExpHistory = this.expHistory.filter(hist => new Date(hist.modifyDate) >= dateStart && new Date(hist.modifyDate) <= dateEnd);
    console.log(dateStart,dateEnd,this.expHistory);
    if(this.filterExpHistory.length==0)
    this.errMessage = "no changes made between these days"
    else
    this.errMessage=""
  }
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
        return;
    }
    this.pager = this.getPager(this.expHistory.length, page);
    this.filterExpHistory = this.expHistory.slice(this.pager.startIndex, this.pager.endIndex + 1);
}
getPager(totalItems: number, currentPage: number = 1, pageSize: number = 5) {
  let totalPages = Math.ceil(totalItems / pageSize);

  let startPage: number, endPage: number;
  
  if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
  } else {
      if (currentPage <= 3) {
          startPage = 1;
          endPage = 5;
      } else if (currentPage + 1 >= totalPages) {
          startPage = totalPages - 4;
          endPage = totalPages;
      } else {
          startPage = currentPage - 2;
          endPage = currentPage+2;
      }
  }
  let startIndex = (currentPage - 1) * pageSize;
  let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
  let pages = _.range(startPage, endPage + 1);
  return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
  };
}
}
