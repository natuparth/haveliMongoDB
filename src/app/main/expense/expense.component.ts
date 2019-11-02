import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/crudServices/crud.service';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { functions } from 'firebase';
import { snapshotChanges } from 'angularfire2/database';
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
  membersList:any[]=[];
  addDisplay: string = 'none';
  updateDisplay : string ='none';
  itemList:any=[];
  updateItemList:any=[];
  previousUserId:number=0;
  memberListTranslate:any=[];
  memberListPos='40%';
  memberListTranslatePos=-165;
  currentUserId:number=-1;
  currentUserName:string='';
  welcomeFlag:boolean=true;
  sideBarExpand:boolean=true;
  additemflag:boolean=false;
  updateitemflag:boolean=false;
  updateItemForm : FormGroup = new FormGroup({
    'name' : new FormControl('',Validators.required),
    'dateOfPurchase' : new FormControl(Date.now,Validators.required),
    'price' : new FormControl('',Validators.required),
    'quantity': new FormControl('',Validators.required),
    'description': new FormControl('',Validators.required)
  });
  addItemForm: FormGroup;
  constructor(private crudService:CrudService,private firestore:AngularFirestore) { }

  ngOnInit() {
    console.log('inside expense management component')
    this.GetUsers();
    console.log(this.membersList.length);
    this.welcomeFlag = true;
    this.addItemForm = new FormGroup({
      'name' : new FormControl('', Validators.required),
      'dateOfPurchase' : new FormControl(Date.now, Validators.required),
      'price' : new FormControl('', Validators.required),
      'consumptionPerDay' : new FormControl('', Validators.required),
      'quantity': new FormControl('', Validators.required),
      'description': new FormControl('', Validators.required)
    })
  }

openModal(itemId:any, modalName: string){
    if(modalName=='addModal')
     {
       this.addDisplay ='block';
     }
     else
     {
       this.updateDisplay = 'block';
       this.UpdateItem(itemId);
     }

}
onCloseHandled(name:string){
  if(name=="addModal")
    this.addDisplay = 'none';
  else
    this.updateDisplay = 'none';
}



  MemberFunction(index:any)
  {
    this.currentUserId=index;
    console.log('memberfunction id:'+this.currentUserId);
    this.welcomeFlag=false;

    if(this.previousUserId!=this.currentUserId || this.previousUserId==0)
    {
      this.membersList[this.previousUserId].background=false;
      this.membersList[index].background=true;
      this.previousUserId=this.currentUserId;
      this.currentUserName=this.membersList[index].id;
      this.GetUserValues(this.membersList[index].id);
    }
  }

  async GetUserValues(id:string)
  {
    this.itemList=[];
    console.log('inside get uservalues function id: '+id);
    var temp=this;
    try
    {
      await this.firestore.collection('expenses').doc(id).collection('list')
      .get()
      .subscribe(function(querysnapshot)
      {
        console.log('inside get items subscribe');
        var  count=0;
        querysnapshot.forEach(function(doc)
        {
          temp.itemList.push(
                  {index:count++,
                    id:doc.id,
                    date:doc.data().dateOfPurchase as Date,
                    desc:doc.data().description,
                    price:doc.data().price,
                    name:doc.data().name,
                    quant:doc.data().quantity
                  });
          // console.log('itemList: ',temp.itemList);
        })
      });
    }
    catch(e)
    {
      console.log('user fetch error');
      alert(e.message);
    }
  }

  async GetUsers()
  {
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
          temp.membersList.push({index:count++,id:doc.id,name:doc.data().name,background:false,pic:'../assets/'+doc.id.toLocaleLowerCase()+'.jpg'});
          temp.memberListTranslate.push('translate('+(temp.memberListTranslatePos+count*55)+'px,0px)');
        })
      })
    }
    catch(e)
    {
      console.log('user fetch error');
      alert(e.message);
    }
  }

  AddItem()
  {
    this.additemflag=true;
  }
  UpdateItem(itemId:any)
  {
    // this.updateitemflag=true;
    var temp=this;
    var id=this.currentUserName;
    this.updateItemList=[];
    try
    {
      this.firestore.collection('expenses').doc(id).collection('list').doc(itemId)
      .get()
      .subscribe(function(doc)
      {
        temp.updateItemList.push(
          {
            id:doc.id,
            dateOfPurchase:doc.data().dateOfPurchase as Date,
            description:doc.data().description,
            price:doc.data().price,
            name:doc.data().name,
            quantity:doc.data().quantity
          });
        console.log('inside get update items subscribe',temp.updateItemList);
      //  temp.updateitemflag=true;
        temp.updateItemForm.get('name').setValue( temp.updateItemList[0].name);
        temp.updateItemForm.get('dateOfPurchase').setValue( temp.updateItemList[0].dateOfPurchase);
        temp.updateItemForm.get('description').setValue( temp.updateItemList[0].description);
        temp.updateItemForm.get('price').setValue( temp.updateItemList[0].price);
        temp.updateItemForm.get('quantity').setValue( temp.updateItemList[0].quantity);
   //   temp.updateItemForm.setValue(temp.updateItemList[0]);

      });
    }
    catch (error)
    {
      alert("Add Item Failed");
      console.log(error.toString);
    }
    // console.log('inside update id:',itemId);
  }

  updateItem(item:FormControl)
  {
    try
    {

        this.firestore.collection('expenses').doc(this.membersList[this.currentUserId].id).collection('list').doc(this.updateItemList[0].id.toString()).set(this.updateItemForm.value).then(()=>{
          console.log('updated the item');
          this.GetUserValues(this.membersList[this.currentUserId].id);
          this.updateDisplay = 'none';
        });
    }
    catch (error)
    {

    }
  }
  addItemSubmit(item:FormGroup)
  {
    var count;
    var countMap={count:null};
    try
    {
      this.firestore.collection('expenses').doc(this.currentUserName)
    .get().subscribe(
      doc=>{
        count=doc.data().count;
        count++;
        countMap.count=count;
        this.firestore.collection('expenses').doc(this.membersList[this.currentUserId].id).collection('list').doc(count.toString()).set(item.value);
        this.firestore.collection('expenses').doc(this.membersList[this.currentUserId].id).update(countMap);
      this.additemflag = false;
      this.GetUserValues(this.membersList[this.currentUserId].id);
      alert('item has been added successfully');
      }
    );
    //get back to current user expense
  //  this.additemflag=false;
 //   alert(item.name+' Added successfully');
    this.previousUserId=0;
    this.MemberFunction(this.currentUserId);
    //end add item function
    }
    catch (error) {
      alert("Add Item Failed");
    }

   // console.log(this.membersList[this.currentUserId].id+item.name+' '+item.price+' '+item.quantity+' '+item.dateOfPurchase+' '+item.description+' '+count);
  }
}
