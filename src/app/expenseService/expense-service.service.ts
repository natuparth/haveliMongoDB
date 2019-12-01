import { Injectable } from '@angular/core';
import { Observable, Subject, pipe } from 'rxjs';
import { Expense } from '../models/expense.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, debounceTime } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private http: HttpClient) {


  }

  public getExpenses(user: string):Observable<any> {

   return this.http.get('http://localhost:3000/api/expense/getExpenses/'+ user);
  }

  public addExpenses(expense: any): Observable<any>{
    return this.http.post<{message: string, errMessage: string}>('http://localhost:3000/api/expense/addExpenses/', expense);
  }
}
