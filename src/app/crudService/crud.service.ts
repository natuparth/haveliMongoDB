import { Injectable } from '@angular/core';
import { Item } from '../models/item.model';
import { Users } from '../models/users.model';
import { Observable, Subject, pipe } from 'rxjs';
import { environment as env} from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  items: Item[];
  users: any[] = [];
  newItem: any;
  userid: string;
  itemsUpdated = new Subject<Item[]>();
  receivedItem = new Subject<Item>();
  message = new Subject<string>();

  constructor(private http: HttpClient) {}
  addItem(item: any) {

    const itemAdded: Item = {
       name: item.name,
       date : item.date,
       quantity : item.quantity,
       consumptionPerDay : item.consumptionPerDay,
       price : item.price

    };

    this.http
      .post(env.apiUrl + '/item/postItem', itemAdded)
      .subscribe(data => {
        console.log('post data successful');
        this.items.push(itemAdded);
        console.log(this.items);
        this.itemsUpdated.next([...this.items]);
      });
  }

  deleteItem(itemName: string) {
    this.http
      .delete(env.apiUrl + '/item/deleteItem/' + itemName)
      .subscribe(() => {
        const updatedItems = this.items.filter(
          itemDeleted => itemDeleted.name !== itemName
        );
        this.items = updatedItems;
        this.itemsUpdated.next([...this.items]);
      });
  }
  // tslint:disable-next-line: whitespace
  updateItem(item: Item, name: string) {
    this.http.put(env.apiUrl + '/item/updateItem/' + name, item, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
   }).subscribe((resData) => {
       console.log(resData);
      this.items.find(itemPassed => itemPassed.name === name).quantity = item.quantity;
      this.items.find(itemPassed => itemPassed.name === name).date = item.date;
      this.items.find(itemPassed => itemPassed.name === name).price = item.price;
      this.itemsUpdated.next([...this.items]);
      if (resData['error'] === 'no error'){
         this.message.next('successfully updated');
      } else {
      this.message.next( resData['error']);
      }
    });
  }

  itemUpdatedMessage() {
    return this.message.asObservable();
  }

  getItem(name: string) {

    this.http.get(env.apiUrl + '/item/getItem/' + name).subscribe((data) => {
        console.log(data);
        this.receivedItem.next(data as Item);
  });
  }

  searchItem(query: string){
     return this.http.get<Item[]>(env.apiUrl + '/item/searchItems/' + query);
  }

  getItemUpdated() {
    return this.receivedItem.asObservable();
  }

  getList() {
    this.http.get<Item[]>(env.apiUrl + '/item/getItems').subscribe(
      items => {
        console.log(items);
        this.items = items;
        this.itemsUpdated.next(this.items);
      },
      err => console.log(err)
    );
  }

  getListUpdated() {
    return this.itemsUpdated.asObservable();
  }

 }
