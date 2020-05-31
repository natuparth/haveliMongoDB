import { Injectable } from '@angular/core';
import { Item } from '../../models/item.model';
import { Users } from '../../models/users.model';
import { Observable, Subject, pipe } from 'rxjs';
import { environment as env} from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  message = new Subject<string>();

  constructor(private http: HttpClient) {}
  addItem(item: any, groupId: string) {

    const itemAdded: Item = {
       name: item.name,
       date : item.date,
       type : item.type,
       measurementUnit: item.measurementUnit,
       quantity : item.quantity,
       consumptionPerDay : item.consumptionPerDay,
       price : item.price

    };
    console.log(itemAdded);
    this.http
      .post<{message: string}>(env.apiUrl + '/item/postItem/' + groupId, itemAdded)
      .subscribe(data => {
        if (data.message === 'successful') {
       if(this.items.length == undefined){
         this.items=[];
       }
        this.items.push(itemAdded);
        this.itemsUpdated.next([...this.items]);
      } else {
      alert('error adding the item to the database');
    }
      });
  }

  deleteItem(itemName: string, groupId: string) {
    let params = new HttpParams();
    params = params.append('name', itemName);
    params = params.append('gid', groupId);
    this.http
      .delete<{message: string , name: string , error: string}>(env.apiUrl + '/item/deleteItem' , {params: params})
      .subscribe((resData) => {
        if (resData.message === 'item deleted successfully'){
        const updatedItems = this.items.filter(
          itemDeleted => itemDeleted.name !== itemName
        );
       this.items = updatedItems;
      }
        this.itemsUpdated.next([...this.items]);
      });
  }
  // tslint:disable-next-line: whitespace
  updateItem(item: Item, name: string, groupId: string) {
    this.http.put(env.apiUrl + '/item/updateItem/' + name + '/' + groupId, item, {
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

  getItem(name: string, groupId: string): Observable<any> {
       return  this.http.get(env.apiUrl + '/item/getItem/' + name + '/' + groupId);
      }

  searchItem(query: string, groupId: string){
     return this.http.get<Item[]>(env.apiUrl + '/item/searchItems/' + query + '/' + groupId);
  }

  getList(groupId: string) {
    this.http.get<Item[]>(env.apiUrl + '/item/getItems/' + groupId ).subscribe(
      data => {
        this.items = data;
        this.itemsUpdated.next(this.items);
      },
      err => console.log(err)
    );
  }

  getListUpdated() {
    return this.itemsUpdated.asObservable();
  }

  getShoppingList(groupId: string): Observable<Item[]> {
      return this.http.get<Item[]>(env.apiUrl + '/item/getItems/' + groupId);


  }



 getItemListKey(itemsList: Array<any>):string{
  let keys = Object.keys(itemsList)
  if(keys[0]=="message")
    return itemsList[keys[0]];
  else
   return "";
 }

}
