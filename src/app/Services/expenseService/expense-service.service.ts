import { Injectable } from '@angular/core';
import { Observable, Subject, pipe } from 'rxjs';
import { Expense } from '../../../../backend/models/expense.js';
import { ExpenseHistory } from '../../../../backend/models/expenseHistory.js';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, debounceTime } from 'rxjs/operators';
import { environment as env } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private http: HttpClient) {


  }

  public getExpenses(email: string):Observable<any> {

   return this.http.get<Expense[]>(env.apiUrl + '/expense/getExpenses/'+ email);
  }

  public getExpenseHistory(groupId: Number):Observable<any> {

    return this.http.get<ExpenseHistory[]>(env.apiUrl + '/expense/getExpensehistory/'+ groupId);
   }

  public addExpenses(expense: any, email:string): Observable<any>{
    const expenseItem : Expense = {
      purpose : expense.purpose,
      amount :  expense.amount,
      dateOfPurchase : expense.dateOfPurchase,
      description : expense.description,
      forWhom : expense.forWhom,
      groupId : expense.groupId
    };
    return this.http.post<{message: string}>(env.apiUrl + '/expense/addExpenses/'+ email, expenseItem);
  }

  public updateExpense(expense : any, email : string, _id : string): Observable<any>{
    const expenseItem : Expense = {
      purpose : expense.purpose,
      amount :  expense.amount,
      dateOfPurchase : expense.dateOfPurchase,
      description : expense.description,
      forWhom : expense.forWhom
    };
    
    return this.http.put<{message: string}>(env.apiUrl + '/expense/updateExpense/'+ email + '/' + _id, expenseItem);
  }

  public deleteExpense(email: string, expense1:any){
    let params = new HttpParams();
    params = params.append('email', email);
    params = params.append('_id', expense1._id);
    return this.http.delete<{message: string}>(env.apiUrl + '/expense/deleteExpense', {params: params});
  }
  public addExpenseHistory(email:string,modifytype:string,expense:any){
    console.log(expense)
    const expenseHistory : ExpenseHistory = {
      modifyType:modifytype,
    modifyDate:new Date(Date.now()),
    modifyBy:localStorage.getItem("userEmail"),
    paidBy:email,
    expense:expense
    };
    this.http.post<{message: string}>(env.apiUrl + '/expense/addExpenseHistory/'+ localStorage.getItem('groupId'), expenseHistory).subscribe(data=>console.log(data));
  }

}
