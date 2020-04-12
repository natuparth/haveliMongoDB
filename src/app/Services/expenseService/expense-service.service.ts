import { Injectable } from '@angular/core';
import { Observable, Subject, pipe } from 'rxjs';
import { Expense } from '../../models/expense.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, debounceTime } from 'rxjs/operators';
import { environment as env } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private http: HttpClient) {


  }

  public getExpenses(user: string):Observable<any> {

   return this.http.get(env.apiUrl + '/expense/getExpenses/'+ user);
  }

  public addExpenses(expense: any, email:string): Observable<any>{
    const expenseItem : Expense = {
      purpose : expense.purpose,
      amount :  expense.amount,
      dateOfPurchase : expense.dateOfPurchase,
      description : expense.description,
      forWhom : expense.forWhom
    };
    console.log("expense item",expenseItem,"expense",expense);
    return this.http.post<{message: string}>(env.apiUrl + '/expense/addExpenses/'+ email, expenseItem);
  }
}
