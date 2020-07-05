import { Component, OnInit, Input, OnChanges, SimpleChanges, DoCheck } from '@angular/core';
import { CrudService } from 'src/app/Services/crudService/crud.service';
import { Observable } from 'rxjs';
import { Item } from 'src/app/models/item.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit ,OnChanges{
  @Input() inputList: any[] = [];
  Items: Observable<Item[]>;
  dropdownButton: String;
  items: any[] = [];
  itemsList: any[] = [];
  showSpinner: boolean;
  errMessage: String;
  errFlag: Boolean = false;
  columnDefs: any = [
    {headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 90},
    {headerName: 'Name', field: 'name' , width: 150}
  ];
  selectedDays: number;
  gridApi: any;
  overlayNoRowTemplate: string;
  constructor(private crudService: CrudService) {}

  ngOnInit() {
    console.log('came inside ngONinit');
    this.dropdownButton = 'less than 5 days';
    this.showSpinner = true;
    this.items = this.inputList;
    this.getShoppingListUpdated(5);
  }
  ngOnChanges(changes: SimpleChanges){
    this.overlayNoRowTemplate = '<div class="text-danger text-center">your haveli is full!! nothing to purchase<br><br><br><br></div>';
    console.log('on change called');
     console.log(changes);
     this.items = changes.inputList.currentValue;
     console.log(changes.inputList.currentValue);
     console.log(this.items);
     this.getShoppingListUpdated(this.selectedDays);
  }


  getShoppingListUpdated(noOfDays: number = 5) {
    console.log('get shopping list called');
    this.dropdownButton = 'less than ' + noOfDays.toString() + ' days';
    this.selectedDays = noOfDays;
    this.itemsList = [];
    if (this.items.length === undefined) {
      this.errMessage = this.crudService.getItemListKey(this.items);
      this.errFlag = true;
    } else {
    this.items.forEach((data, index) => {
    const cutOffDays = (new Date(new Date().getTime() + noOfDays * 1000 * 3600 * 24)) ;
      // tslint:disable-next-line: max-line-length
      if (
          data.quantity - ( data.consumptionPerDay * (cutOffDays.getTime() - (new Date(data.date).getTime())) / (1000 * 3600 * 24)) <= 0
       ) {
        this.itemsList.push(data);
      }
      if(index == this.items.length - 1){
        console.log('came inside set');
        if (this.gridApi) {
          console.log(this.itemsList);
          this.gridApi.setRowData(this.itemsList);
          console.log('this.gridApi set data called');
        }
      }
    });


  }
    this.showSpinner = false;
  }

  onGridReady(event: any){
    this.gridApi = event.api;

  }
}
