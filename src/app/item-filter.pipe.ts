import { Pipe, PipeTransform } from '@angular/core';
import { Item } from './models/item.model';

@Pipe({
  name: 'itemFilter',
  pure: false
})
export class ItemFilterPipe implements PipeTransform {

  transform(value: any, filterString:string): any {
     if(filterString=='')
      return value;
     for(const item of value){
       if(item.name===filterString)
         return item;
     } 

  }

}
