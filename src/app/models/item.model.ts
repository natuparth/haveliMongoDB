export class Item {

name: String;
quantity: number;
date: Date;
type: String;
measurementUnit: ['units', 'grams'];
consumptionPerDay?: number;
price: number;
imageUrl?: String;

constructor(value: any){
 Object.assign(this, value);
}

}




