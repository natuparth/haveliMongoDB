export class Item {

name: String;
quantity:number;
date:Date;
consumptionPerDay?:number;
price:number;
imageUrl?:String;

constructor(value: any){
  // this.name = value.name;
  // this.quantity = value.quantity;
  // this.date = value.date;
  // this.price = value.price;
  // this.consumptionPerDay = value.consumptionPerDay;
 Object.assign(this,value);
}

}




