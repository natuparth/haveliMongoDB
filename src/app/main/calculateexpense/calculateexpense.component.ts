import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {formatDate} from '@angular/common';


@Component({
  selector: 'app-calculateexpense',
  templateUrl: './calculateexpense.component.html',
  styleUrls: ['./calculateexpense.component.css']
})
export class CalculateexpenseComponent implements OnInit {

  constructor() { }

  welcomeFlag : boolean = false;
  dateselecttoggle : boolean = false;
  membername : string = "";
  dateAbsent : { [index : string] : number[] } = {};
  multidate : Date;
  dateModalDisplay : number[][];

  users: {name: string, amount: number}[] =[
    {name:  'Parth' , amount: 0.00},
    {name: 'Rahul'  , amount: 0.00 },
    {name: 'Shubham'  , amount: 0.00}
   ];

  ngOnInit()
  {
    for(var obj of  this.users)
    {
      this.dateAbsent[obj.name] = [];
    }
  }

  submitForm(form:NgForm)
  {
    console.log("file name",form.value.inputFile);
  }

  closeModal($event) {
    this.dateselecttoggle = false;
    var selectedDate = + (formatDate(this.multidate, 'dd', 'en'));
    var memberDates = this.dateAbsent[this.membername];
    if(memberDates.indexOf(selectedDate) == -1)
    {
      memberDates.push(selectedDate);
      this.dateAbsent[this.membername]=memberDates;
    }
    //timeout is set to reload the table for absent dates
    setTimeout(()=>{
      this.dateselecttoggle = true;
      }, 10);
    
  }
  keys() : Array<string> {
    return Object.keys(this.dateAbsent);
  }

}
