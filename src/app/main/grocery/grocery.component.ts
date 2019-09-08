import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Item } from 'src/app/models/item.model';
import { toArray } from 'rxjs/operators';
import { CrudService } from 'src/app/crudServices/crud.service';
import { Observable } from 'rxjs';
import { NgForm, FormGroup, FormControlName, FormControl, Validators } from '@angular/forms';
import { analyzeAndValidateNgModules } from '@angular/compiler';
@Component({
  selector: 'app-grocery',
  templateUrl: './grocery.component.html',
  styleUrls: ['./grocery.component.css']
})
export class GroceryComponent implements OnInit {
  addItemForm: FormGroup;
  updateItemForm: FormGroup = new FormGroup({
    'name' : new FormControl(''),
    'date' : new FormControl('', [Validators.required, this.dateValidator.bind(this)]),
    'price' : new FormControl('', Validators.required),
    'quantity' : new FormControl('', Validators.required )


  });
  public modelHidden: boolean;
  Items: Observable<Item[]>;
  itemsList: Array<Item> = [];
  itemsCol: AngularFirestoreCollection<Item>;
  addDisplay: String = 'none';
  display: String = 'none';
  itemName: string;
  itemDate: Date;
  filteredList: any[] = [];
  itemsArray: any[] = [];
  filterString = '';
  constructor(private crudService: CrudService, private firestore: AngularFirestore) {

  }

  addItem(item: any) {
   // console.log(item)
    this.crudService.addItem(item.value);
    this.modelHidden = true;
    // alert('item has been added successfully')
    this.addDisplay = 'none';
  }



  makeModalVisible() {
    console.log('visible method called');
    this.modelHidden = false;
  }
  hideModal() {
    this.modelHidden = true;
  }

  ngOnInit() {
    // this.crudService.getList().subscribe(data => {
    //  this.crudService.getList().subscribe(items =>{
    //  this.itemsList = items;

      // console.log(this.itemsList)
  //   });
     this.crudService.getList();
     this.crudService.getListUpdated().subscribe((items) => {
       console.log('subscription got called');
       items.forEach((item) => {
       //  const dateString = item.date.toString();
      //   console.log(dateString);
     // var d = new Date(item.date);
        // item.date = new Date(d.toLocaleDateString());
         console.log(item.date);
       })
       this.itemsList = items;
     });


      this.addItemForm = new FormGroup({
        'name' : new FormControl('', Validators.required),
        'date' : new FormControl(Date.now, Validators.required),
        'price' : new FormControl('', Validators.required),
        'consumptionPerDay' : new FormControl('', Validators.required),
        'quantity': new FormControl('', Validators.required)
      });



    this.modelHidden = true;

    this.updateItemForm.statusChanges.subscribe((status) => {
      console.log(status);
      console.log(this.updateItemForm);
    });
  }
  openModal(name: String, date: Date) {
    this.itemName = name as string;
    this.itemDate = date ;
    this.display = 'block';

  }
  openAddModal() {
    this.addDisplay = 'block';
  }
  onCloseHandled(modalName: String) {
    if (modalName === 'add') {
    this.addDisplay = 'none';
    }
    else {
    this.display = 'none';
    }
  }

  updateItem() {
    const item: Item = new Item();
    console.log(this.itemName);
    this.crudService.getItem(this.itemName);
    this.crudService.getItemUpdated().subscribe((doc) => {
      console.log(doc[0].date);
      const date1 = new Date(this.updateItemForm.get('date').value);
      const date2 = new Date(doc[0].date);
      console.log(date1);
      //console.log(typeof date2);
      //const type2 = typeof date2;
      console.log(date2);
      const diff = Math.abs(date2.getTime() - date1.getTime());
      const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
      if (diffDays < 0) {
      alert('the current purchase date cannot be prior to the last purchase date')
      }
      console.log(diffDays);
      item.quantity = this.updateItemForm.get('quantity').value + (doc[0].quantity - (diffDays * doc[0].consumptionPerDay));
     // console.log(item.quantity);
      if (item.quantity < 0) {
        item.quantity = 0;
       }
      item.name = this.itemName;
      item.consumptionPerDay = doc[0].consumptionPerDay;
      item.date = this.updateItemForm.get('date').value;
      item.price = doc[0].price;
      this.crudService.updateItem(item, this.itemName);
      this.crudService.itemUpdatedMessage().subscribe((message)=>{
           if (message === 'successfully updated') {
             console.log('onClosehandled called');
            // this.onCloseHandled('update');
           } else {
            alert('Error while updating the object. Error: '+ message );
           }

           this.onCloseHandled('update');
      });
      //  message.then((value) => {
    //    if (value ==='item updated successfully') {
    //     this.onCloseHandled('update');
    //    }
    //  });
    });

   // this.crudService.updateItem(item, this.itemName);

  }

 shoppingList() {
    this.itemsCol = this.firestore.collection('shoppingList');
    this.itemsCol.get().subscribe(doc => {
      doc.docs.forEach(docu => {
        this.itemsArray.push(docu.data());
        //  console.log(docu.data());

      });
      // console.log(this.itemsArray);
      for (const item of this.itemsArray) {
        let date1 = new Date();
        const date2 = new Date(item.dateOfLastPurchase);
        let diff = Math.abs(date2.getTime() - date1.getTime());
        let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
        // console.log(diffDays);
     }



   });

  }

  validateDate(date: Date) {
    console.log(date.toString);
    console.log(this.itemDate);
    console.log(this.updateItemForm);
    if (date.toString() == '') {
    this.updateItemForm.get('date').setErrors({required: true});
    }
   else if (date < this.itemDate && date.toString() != '') {
     // alert('the entered date is prior to the last purchase date');
      this.updateItemForm.get('date').setErrors({'invalidDate': true});
    } else {
      this.updateItemForm.get('date').setErrors({'invalidDate': null});
    }

  }

  dateValidator(control: FormControl): {[s: string]: boolean} {
   // console.log(control.value);
    // console.log(this.itemDate);
    if (control.value < this.itemDate && control.value.toString() != '') {
     return {'invalidDate': true}
    }
     else {
      return null;
    }
  }

  deleteItem(item: string) {
    if (confirm('Are you sure you want to remove ' + item + ' from grocery list')) {
    this.crudService.deleteItem(item);
    }

  }

}


