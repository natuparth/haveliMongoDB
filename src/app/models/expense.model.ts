export class Expense{
  purpose: String;
  amount : Number;
  dateOfPurchase: Date;
  description : String;
  forWhom : [];

  constructor(value: any){
   Object.assign(this,value);
  }
}
