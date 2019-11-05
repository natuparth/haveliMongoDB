import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/crudServices/crud.service';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(private crudService:CrudService) { }

  ngOnInit() {
    this.GetUsers();
  }
  membersList:any[]=[];
  async GetUsers()
  {/*
    var temp=this;
    this.membersList=[];
    console.log('inside expense get user');
    try
    {
      await this.firestore.collection('expenses')
      .get()
      .subscribe(function(querysnapshot)
      {
        var count=0;
        querysnapshot.forEach(function(doc)
        {
          temp.membersList.push({index:count++,id:doc.id,name:doc.data().name,background:false});
        })
      })
    }
    catch(e)
    {
      console.log('user fetch error');
      alert(e.message);
    }

  */}

}
