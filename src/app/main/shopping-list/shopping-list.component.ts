import { Component, OnInit } from "@angular/core";
import { CrudService } from "src/app/Services/crudService/crud.service";
import { Observable } from "rxjs";
import { Item } from "src/app/models/item.model";

@Component({
  selector: "app-shopping-list",
  templateUrl: "./shopping-list.component.html",
  styleUrls: ["./shopping-list.component.css"]
})
export class ShoppingListComponent implements OnInit {
  Items: Observable<Item[]>;
  items: any[] = [];
  itemsList: any[] = [];
  showSpinner: boolean;
  constructor(private crudService: CrudService) {}

  ngOnInit() {
    this.showSpinner = true;
    console.log("ngOnInitCalled");
    this.crudService.getShoppingList().subscribe(data => {
      this.items = data;
      this.getShoppingListUpdated(5);
    });
  }

  getShoppingListUpdated(noOfDays: number = 5) {
    this.itemsList = [];
    console.log(this.itemsList);
    this.items.forEach(data => {
      // tslint:disable-next-line: max-line-length
      console.log(
        data.quantity -
          (data.consumptionPerDay *
            (new Date(new Date().getTime() + noOfDays * 1000 * 3600 * 24) -
              new Date(data.date).getTime())) /
            (1000 * 3600 * 24)
      );
      // tslint:disable-next-line: max-line-length
      if (
        data.quantity -
          (data.consumptionPerDay *
            (new Date(new Date().getTime() + noOfDays * 1000 * 3600 * 24) -
              new Date(data.date).getTime())) /
            (1000 * 3600 * 24) <=
        0
      ) {
        this.itemsList.push(data);
      }
    });

    this.showSpinner = false;
  }
}
