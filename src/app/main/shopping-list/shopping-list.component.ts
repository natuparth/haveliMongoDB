import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/crudServices/crud.service';
import { Observable } from 'rxjs';
import { Item } from 'src/app/models/item.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
 Items:Observable<Item[]>;
 items:any[]=[];
 showSpinner:boolean;
  constructor(private crudService:CrudService) { }

  ngOnInit() {
//     this.showSpinner=true;
//     var db=firebase.firestore();
//     var collections=db.collection('shoppingList');
//    this.crudService.getFilteredList().subscribe(
//    (itemsList: Item[])=>{
// //     this.items=itemsList;
//      itemsList.forEach((data)=>{
//    // console.log((new Date().getTime()-new Date(data.dateOfLastPurchase).getTime())/(1000*3600*24));
//        //console.log(data.quantity-(data.consumptionPerDay*(new Date().getTime()-new Date(data.dateOfLastPurchase).getTime())/(1000*3600*24)));
//        if(data.quantity-(data.consumptionPerDay*(new Date().getTime()-new Date(data.date).getTime())/(1000*3600*24))<=5)
//            this.items.push(data);
//        }
//        )
//      this.showSpinner=false;
//      console.log(this.items);
//    }

//    )

  }

}
