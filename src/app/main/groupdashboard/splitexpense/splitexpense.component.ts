import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';
import { GroupService } from 'src/app/Services/groupService/group.service';

@Component({
  selector: 'app-splitexpense',
  templateUrl: './splitexpense.component.html',
  styleUrls: ['./splitexpense.component.css']
})
export class SplitexpenseComponent implements OnInit {

  @Input() graphDataList: any[] = [];
  @Input() groupDetails: any;
  windowHeight: Number = 0;
  loadingFlag: boolean = true;
  
  splitBubbleData: { [id: string]: memberDetails } = {};
  constructor(private groupService: GroupService,private er: ElementRef) { }

  ngOnInit() {
    this.splitBubbleDesign();
  }

  splitBubbleDesign(){
    this.loadingFlag = true;
    let dataSize = this.graphDataList.length;
    this.groupService.getGroupMembersByGroupId(this.groupDetails.groupId).subscribe((data)=>{
      let groupDataSize = data.length;
      for(let i=0; i<groupDataSize; i++){
        this.splitBubbleData[data[i].email] = { name: data[i].name.split(' ')[0], price: 0 }
      }
      for(let k=0; k<dataSize; k++){
        let expLength = this.graphDataList[k].data.length;
        this.splitBubbleData[this.graphDataList[k]._id.email].price += this.graphDataList[k].TotalAmount;
        for(let j=0; j<expLength; j++){
          let expAmount = this.graphDataList[k].data[j].expenses.amount;
          let forWhom = this.graphDataList[k].data[j].expenses.forWhom;
          let paidBy = this.graphDataList[k]._id.email;
          let noOfMember = forWhom.length;
          let amountPerMember = expAmount / noOfMember;
          for(let m=0; m<noOfMember; m++){
            this.splitBubbleData[forWhom[m]].price -= amountPerMember;  
          }
        }
      }
      setTimeout(()=>{ this.loadingFlag = false; }, 800);
      
    });
  }
}

interface memberDetails {
  name: string;
  price: number;
}