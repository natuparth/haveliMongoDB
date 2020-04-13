import { Injectable } from '@angular/core';
import { Observable, Subject, pipe } from 'rxjs';
import { Expense } from '../../models/expense.model';
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

  public addExpenses(expense: any, email:string): Observable<any>{
    const expenseItem : Expense = {
      purpose : expense.purpose,
      amount :  expense.amount,
      dateOfPurchase : expense.dateOfPurchase,
      description : expense.description,
      forWhom : expense.forWhom
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

  public deleteExpense(email: string, _id: string){
    let params = new HttpParams();
    params = params.append('email', email);
    params = params.append('_id', _id);
    return this.http.delete<{message: string}>(env.apiUrl + '/expense/deleteExpense', {params: params});
  }

}
