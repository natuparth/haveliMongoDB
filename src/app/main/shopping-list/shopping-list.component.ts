import { Component, OnInit, Input } from '@angular/core';
import { CrudService } from 'src/app/Services/crudService/crud.service';
import { Observable } from 'rxjs';
import { Item } from 'src/app/models/item.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
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
  constructor(private crudService: CrudService) {}

  ngOnInit() {
    this.dropdownButton = 'less than 5 days';
    this.showSpinner = true;
    this.items = this.inputList;
    this.getShoppingListUpdated(5);
  }

  getShoppingListUpdated(noOfDays: number = 5) {
    this.dropdownButton = 'less than ' + noOfDays.toString() + ' days';
    this.itemsList = [];
    if (this.items.length === undefined) {
      this.errMessage = this.crudService.getItemListKey(this.items);
      this.errFlag = true;
    } else {
    this.items.forEach(data => {
    const cutOffDays = (new Date(new Date().getTime() + noOfDays * 1000 * 3600 * 24)) ;
      // tslint:disable-next-line: max-line-length
      if (
          data.quantity - ( data.consumptionPerDay * (cutOffDays.getTime() - (new Date(data.date).getTime())) / (1000 * 3600 * 24)) <= 0
       ) {
        this.itemsList.push(data);
      }
      if (this.itemsList.length === 0) {
        this.errMessage = 'your haveli is full!! nothing to purchase in ' + noOfDays.toString() + ' days';
        this.errFlag = true;
      } else {
        this.errFlag = false;
      }
    });
  }
    this.showSpinner = false;
  }
}
