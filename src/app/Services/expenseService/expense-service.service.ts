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

  public addExpenses(expense: any): Observable<any>{
    return this.http.post<{message: string, errMessage: string}>(env.apiUrl + '/expense/addExpenses/', expense);
  }
}
