import { Component, OnInit, Input } from '@angular/core';
import { GroupService } from 'src/app/Services/groupService/group.service';

@Component({
  selector: 'app-groupdashboard',
  templateUrl: './groupdashboard.component.html',
  styleUrls: ['./groupdashboard.component.css']
})
export class GroupdashboardComponent implements OnInit {

  @Input() groupDetails: any;
  groupName: String = '';
  groupMap = new Map<Number, Group>();
  expCompareData: any[] = [];
  expDateGraphData: any[] = [];
  expCompareFlag: boolean = false;
  expByDateFlag: boolean = false;
  expCompareDataLabels: String[] = [];
  expDateGraphDataLabels: String[] = [];
  splitGraphData: any[] = [];
  splitGraphFlag: boolean = false;
  constructor(private groupService: GroupService) { }

  ngOnInit() {
    // console.log(this.groupDetails);
    this.groupName = this.groupDetails.groupName;
    this.getExpenseDataOfGroups();
  }

  /**/
  getExpenseDataOfGroups(){
    this.groupService.getGroupMembersExpense(this.groupDetails.groupId).subscribe((data) => {
      let dataSize = data.length;
      // console.log(data);
      if(dataSize){
        this.splitGraphData = data;
        this.splitGraphFlag = true;
        for( let i=0; i<dataSize; i++){
          let name = data[i]._id.name.split(' ')[0];
          let amount = data[i].TotalAmount;
          this.expCompareData.push({ name:name, data:amount });
          // console.log(data[i].data[0].expenses)
          let expLength = data[i].data.length;
          let expData = [];
          for( let j=0; j<expLength; j++){
            let dt = new Date(data[i].data[j].expenses.dateOfPurchase);
            let dd = dt.getDate();
            let mm = dt.getMonth();
            let yy = dt.getFullYear();
            // console.log(dd,mm,yy);
            expData.push([Date.UTC(yy,mm,dd),data[i].data[j].expenses.amount])
          }
          // this.expDateGraphData.push({ name: name, data: })
          let seriesData = { name: name, data: expData};
          this.expDateGraphData.push(seriesData);
          // console.log("seer",seriesData);
        }
        // console.log("seer",this.expDateGraphData,this.expDateGraphData.length);
        this.expCompareDataLabels = ["Name","Total Expense"]
        this.expDateGraphDataLabels = ["Expense By Date","Date Of Purchase","Amount"];
        this.expCompareFlag = true;
        this.expByDateFlag = true;
      }
    });    
  }

}
// data.users.forEach((user)=>{
      //   console.log(user)
      // })
        // console.log(data.users.length,data)
        //   data.users.forEach((user) => {
        //   const usersArray = this.groupMap.get(user.groups).users;
        //   usersArray.push(user.name);
        //   this.groupMap.set(user.groups, Object.assign({...this.groupMap.get(user.groups)}, {users: usersArray}));
        // });

// this.groupService.getGroups(localStorage.getItem('userEmail')).subscribe((doc) => {
    //   const size = doc.items.length;
    //   for (let i = 0; i < size; i++) {
    //     this.groupMap.set(doc.items[i].groupId, { name: doc.items[i].groupName, users: []});
    //   }
    //   console.log('size',doc)
    //   // console.log(this.groupMap)
    // });
interface Group {
  name: string;
  users: Array<any>;
}