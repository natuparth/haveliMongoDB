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
  expCompareData: any[]=[];
  expCompareFlag: boolean = false;
  expByDateFlag: boolean = true;
  expLabels: String[] = [];
  splitGraphFlag: boolean = true;
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
      // console.log(dataSize);
      if(dataSize){
        for( let i=0; i<dataSize; i++){
          let name = data[i]._id.name.split(' ')[0];
          let amount = data[i].TotalAmount;
          this.expCompareData.push({name:name,data:amount})
        }
        this.expLabels = ["Name","Total Expense"]
        this.expCompareFlag = true;
      }
      console.log(this.expCompareData.length);
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