import { Component, OnInit } from '@angular/core';
import { Item } from 'src/app/models/item.model';
import { switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CrudService } from 'src/app/Services/crudService/crud.service';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/Services/authService/auth.service';
@Component({
  selector: 'app-grocery',
  templateUrl: './grocery.component.html',
  styleUrls: ['./grocery.component.css']
})
export class GroceryComponent implements OnInit {
   searchForm: FormGroup;
   users: {email: string, password: string, name: string}[] = [
    {email:  'sayantan.ghosh' , password: 'sentisenti', name: 'sayantan ghosh'},
    {email: 'shubham.tayal'  , password: 'tayaltayal', name: 'shubham tayal' }
   ];
  addItemForm: FormGroup;
  updateItemForm: FormGroup = new FormGroup({
    'name' : new FormControl(''),
    'date' : new FormControl('', [Validators.required, this.dateValidator.bind(this)]),
    'price' : new FormControl('', Validators.required),
    'quantity' : new FormControl('', Validators.required )
  });
  public modelHidden: boolean;
  groupId: string;
  Items: Observable<Item[]>;
  itemsList: Array<any> = [];
  addDisplay: String = 'none';
  display: String = 'none';
  itemName: string;
  itemDate: Date;
  itemsArray: any[] = [];
  welcomeFlag = true;
    errMessage:String;
  errFlag:Boolean=false;

  constructor(private crudService: CrudService, private formBuilder: FormBuilder, private authService: AuthService) {
     this.groupId = localStorage.getItem('groupId');
    this.searchForm = this.formBuilder.group({
          search: ['', Validators.required]
        });

   this.searchForm.controls.search.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(query => {
      if (query === '') {
        query = 'all';
      }
      return this.searchItem(query);
      }),
     ).subscribe(value => {
      this.itemsList = value.map(item => new Item(item)) ;
      console.log(this.itemsList);
   });
  }


  ngOnInit() {
    const groupId = localStorage.getItem('groupId');
    this.crudService.getList(groupId);
    this.crudService.getListUpdated().subscribe((items) => {
      console.log('subscription got called');
        this.itemsList = items;
        if(this.itemsList.length==0)
        location.reload();
        if(this.crudService.getItemListKey(this.itemsList)!=""){
        this.errMessage=this.crudService.getItemListKey(this.itemsList);
        this.errFlag=true;
      }
      else{
      this.errFlag=false;
      this.itemsArray = items;
      }
      this.welcomeFlag = false;
    });

    this.addItemForm = new FormGroup({
       'name' : new FormControl('', Validators.required),
       'date' : new FormControl(Date.now, Validators.required),
       'type' : new FormControl('', Validators.required),
       'measurementUnit' : new FormControl('', Validators.required),
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


  addItem(item: any) {
    this.crudService.addItem(item.value, this.groupId);
    this.modelHidden = true;
    this.addDisplay = 'none';
  }



  makeModalVisible() {
    console.log('visible method called');
    this.modelHidden = false;
  }
  hideModal() {
    this.modelHidden = true;
  }


  openModal(name: String, date: Date) {
    this.itemName = name as string;
    this.itemDate = date ;
    this.display = 'block';

  }
  openAddModal() {
    this.addItemForm = new FormGroup({
      'name' : new FormControl('', Validators.required),
      'date' : new FormControl(Date.now, Validators.required),
      'type' : new FormControl('', Validators.required),
      'measurementUnit' : new FormControl('', Validators.required),
      'price' : new FormControl('', Validators.required),
      'consumptionPerDay' : new FormControl('', Validators.required),
      'quantity': new FormControl('', Validators.required)
    });
    this.addDisplay = 'block';
  }
  onCloseHandled(modalName: String) {
    if (modalName === 'add') {
    this.addDisplay = 'none';
    } else {
    this.display = 'none';
    }
  }

  updateItem() {
    const item: Item = new Item(null);
    console.log(this.itemName);
    this.crudService.getItem(this.itemName, this.groupId).subscribe((doc) => {
      console.log(doc[0].date);
      const date1 = new Date(this.updateItemForm.get('date').value);
      const date2 = new Date(doc[0].date);
      console.log(date1);
      console.log(date2);
      const diff = Math.abs(date2.getTime() - date1.getTime());
      const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
      if (diffDays < 0) {
      alert('the current purchase date cannot be prior to the last purchase date');
      }
      console.log(diffDays);
      item.quantity = this.updateItemForm.get('quantity').value + (doc[0].quantity - (diffDays * doc[0].consumptionPerDay));
      if (item.quantity < 0) {
        item.quantity = 0;
       }
      item.name = this.itemName;
      item.consumptionPerDay = doc[0].consumptionPerDay;
      item.date = this.updateItemForm.get('date').value;
      item.price = doc[0].price;
      this.crudService.updateItem(item, this.itemName, this.groupId);
      this.crudService.itemUpdatedMessage().subscribe((message) => {
           if (message === 'successfully updated') {
             console.log('onClosehandled called');
           } else {
            alert('Error while updating the object. Error: ' + message );
           }

           this.onCloseHandled('update');
      });
    });
  }


  validateDate(date: Date) {
    if (date.toString() === '') {
    this.updateItemForm.get('date').setErrors({required: true});
    } else if (date < this.itemDate && date.toString() !== '') {
    this.updateItemForm.get('date').setErrors({'invalidDate': true});
    } else {
      this.updateItemForm.get('date').setErrors({'invalidDate': null});
    }

  }

  dateValidator(control: FormControl): {[s: string]: boolean} {

    if (control.value < this.itemDate && control.value.toString() !== '') {
     return {'invalidDate': true};
    } else {
      return null;
    }


  }

  deleteItem(item: string) {
    if (confirm('Are you sure you want to remove ' + item + ' from grocery list')) {
    this.crudService.deleteItem(item, this.groupId);
    }
  }

  searchItem(query: string): Observable<Item[]> {
    const regex = new RegExp('^' + query + '$');
   const filtered =  this.itemsList.filter((item) => {
      return item.name.includes(query);
      });
      this.Items = new Observable(observer => {
        if (query === 'all'){
          observer.next(this.itemsArray);
        } else {
        observer.next(filtered);
        }
      });
    return this.Items;
  }
}


