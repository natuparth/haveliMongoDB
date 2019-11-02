import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {formatDate} from '@angular/common';
import * as XLSX from 'ts-xlsx';


@Component({
  selector: 'app-calculateexpense',
  templateUrl: './calculateexpense.component.html',
  styleUrls: ['./calculateexpense.component.css']
})
export class CalculateexpenseComponent implements OnInit {

  constructor() { }

  welcomeFlag : boolean = false;
  xlsDataFlag : boolean = false;
  dateselecttoggle : boolean = false;
  membername : string = "";
  dateAbsent : { [index : string] : number[] } = {};
  noOfMembersPresent : any;
  multidate : Date;
  dateModalDisplay : number[][];
  xlsFileData : any;
  arrayBuffer:any;
  file:File;

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
    var arr = new Array(30);
    arr.fill(this.users.length);
    this.noOfMembersPresent = arr;
  }

  calculateExpense()
  {
    var rate = this.xlsFileData[0].Rate;
    console.log("start calculating",rate,this.xlsFileData.length);
    for(var i = 0;i < this.xlsFileData.length; i++)
    {
      var packets = this.xlsFileData[i].Pkts;
      if(packets)
      {
        for(var j = 0; j < this.users.length; j++)
        {
          var index = this.dateAbsent[this.users[j].name].indexOf(i+1);
          if(index == -1)
          {
            this.users[j].amount = this.users[j].amount + packets * rate / this.noOfMembersPresent[i];
          }
        }
        console.log(i,this.users);
      }
    }
    console.log("calculating complete",this.users);
  }

  addAbsentDate($event)
  {
    this.dateselecttoggle = false;
    var selectedDate = + (formatDate(this.multidate, 'dd', 'en'));
    var memberDates = this.dateAbsent[this.membername];
    var indexOfDate = memberDates.indexOf(selectedDate);
    if( indexOfDate == -1)
    {
      memberDates.push(selectedDate);
      this.noOfMembersPresent[selectedDate-1]--;
    }
    else
    {
      memberDates.splice(indexOfDate,1);
      this.noOfMembersPresent[selectedDate-1]++;
    }
    this.dateAbsent[this.membername]=memberDates.sort((a, b) => {
      if (a < b) return -1;
      else if (a> b) return 1;
      else return 0;
      });
    //timeout is set to reload the table for absent dates
    setTimeout(()=>{ this.dateselecttoggle = true; }, 10);
  }

  incomingfile(event) 
  {
    this.xlsDataFlag = false;
    this.file= event.target.files[0]; 
    if(this.file)
    {
      this.readxls();
    }
  }

  readxls() 
  {
    var datagot:any;
    var fileReader : FileReader = new FileReader();
    fileReader.onload = () => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, {type:"binary"});
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      this.xlsFileData = XLSX.utils.sheet_to_json(worksheet,{raw:true});
      this.xlsDataFlag = true;
    }
    fileReader.readAsArrayBuffer(this.file);
  }
}
