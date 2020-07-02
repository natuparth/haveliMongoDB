import { Component, OnInit, OnChanges, SimpleChanges, AfterContentInit, AfterViewInit, Input } from '@angular/core';
import { Item } from 'src/app/models/item.model';
import { switchMap, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { CrudService } from 'src/app/Services/crudService/crud.service';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/Services/authService/auth.service';
import * as moment from 'moment';
import { GridOptions } from 'ag-grid-community';
@Component({
  selector: 'app-grocery',
  templateUrl: './grocery.component.html',
  styleUrls: ['./grocery.component.css']
})
export class GroceryComponent implements OnInit  {
  searchForm: FormGroup;
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
  itemsArray: Array<any> = [];
  addDisplay: String = 'none';
  display: String = 'none';
  itemName: string;
  itemDate: Date;
  welcomeFlag = true;
  errMessage: String;
  errFlag: Boolean = false;
  columnDefs = [
    {headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 90},
    {headerName: 'Name', field: 'name' , width: 150},
    {headerName: 'Type', field: 'type', sortable: true, filter: true , width: 150},
    {headerName: 'Quantity', field: 'quantity', width: 120,
        valueGetter(params) {
           return params.data.quantity.toString() + (params.data.measurementUnit === 'units' ? ' U' : ' g');
        }
    },
    {headerName: 'Last Purchase Date', field: 'date', width: 180,
    valueGetter(params) {
      return moment(params.data.date).format('D MMM YYYY');
   }}
];
 rowData: any = [];
 gridApi;
 overlayNoRowTemplate ;


  constructor(private crudService: CrudService, private formBuilder: FormBuilder, private authService: AuthService) {
    this.groupId = localStorage.getItem('groupId');
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
     this.searchForm = this.formBuilder.group({
          search: ['', Validators.required]
        });

   this.searchForm.controls.search.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(query => {
        return this.searchItem(query);
      }),
     ).subscribe(value => {
      this.itemsList = value.map(item => new Item(item)) ;
   });
  }

  ngOnInit() {
    const groupId = localStorage.getItem('groupId');
    this.crudService.getList(groupId);
    this.crudService.getListUpdated().subscribe((items) => {
        this.itemsList = items;
        this.itemsArray = items;
         if (this.itemsList.length === undefined || this.itemsList.length === 0) {
            this.rowData = [];
            if (this.itemsList.length === 0) {
               this.errMessage = 'Items not available! Please Add';
             } else {
             this.errMessage = this.crudService.getItemListKey(this.itemsList);
             }
        this.overlayNoRowTemplate = '<div class="text-danger text-center"><br><br>' + this.errMessage + '<br><br></div>';
        this.errFlag = true;
        } else {
          this.rowData = this.itemsList;
          if (this.gridApi) {
             this.gridApi.setRowData(this.rowData);
           }
         this.errFlag = false;
       }
             this.welcomeFlag = false;
    });
 }


  addItem(item: any) {
    this.crudService.addItem(item.value, this.groupId);
    this.modelHidden = true;
    this.addDisplay = 'none';
  }



  makeModalVisible() {
    this.modelHidden = false;
  }
  hideModal() {
    this.modelHidden = true;
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
    this.crudService.getItem(this.itemName, this.groupId).subscribe((doc) => {
      const date1 = new Date(this.updateItemForm.get('date').value);
      const date2 = new Date(doc[0].date);
      const diff = Math.abs(date2.getTime() - date1.getTime());
      const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
      if (diffDays < 0) {
       alert('the current purchase date cannot be prior to the last purchase date');
      }
      item.quantity = this.updateItemForm.get('quantity').value + (doc[0].quantity - (diffDays * doc[0].consumptionPerDay));
      if (item.quantity < 0) {
        item.quantity = 0;
       }

      item.name = this.itemName;
      item.type = doc[0].type;
      item.measurementUnit = doc[0].measurementUnit;
      item.consumptionPerDay = doc[0].consumptionPerDay;
      item.date = this.updateItemForm.get('date').value;
      item.price = doc[0].price;
      this.crudService.updateItem(item, this.itemName, this.groupId);
      this.crudService.itemUpdatedMessage().subscribe((message) => {
           if (message !== 'successfully updated') {
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

  deleteItem() {
    if (confirm('Are you sure you want to remove ' + this.itemName + ' from grocery list')) {
    this.crudService.deleteItem(this.itemName, this.groupId);
    this.display = 'none';

    }
  }

  searchItem(query: string): Observable<Item[]> {
    const filteredList = this.itemsArray;
    const regex = new RegExp('^' + query + '$');
    const filtered = query === '' ? filteredList : (filteredList.filter((item) => {
         return item.name.includes(query);
      }));
      this.Items = new Observable(observer => {
          observer.next(filtered);
        });
    return this.Items;
  }

  onRowClicked(event: any) {
    this.itemName = event.data.name as string;
    this.itemDate = event.data.date ;
    this.display = 'block';
  }

  onGridReady(event: any) {
  this.gridApi = event.api;
  }
}


