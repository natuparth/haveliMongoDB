import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { GroceryComponent } from './main/grocery/grocery.component';
import { ExpenseComponent } from './main/expense/expense.component';
import { HomeComponent } from './home/home.component';
import { environment } from '../environments/environment';
import { CrudService } from './crudService/crud.service';
import { ShoppingListComponent } from './main/shopping-list/shopping-list.component';
import { MilkComponent } from './main/milk/milk.component';
import { TestComponent } from './test/test.component';
import { ItemFilterPipe } from './item-filter.pipe';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './authService/auth.service';
import { AuthInterceptor } from './authService/auth-interceptor';
import { CalculateexpenseComponent } from './main/calculateexpense/calculateexpense.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    GroceryComponent,
    ExpenseComponent,
    HomeComponent,
    ShoppingListComponent,
    MilkComponent,
    TestComponent,
    ItemFilterPipe,
    LoginComponent,
    CalculateexpenseComponent
  ],
  imports: [FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],

  providers: [
     CrudService,
    {
      provide: HTTP_INTERCEPTORS,
       useClass: AuthInterceptor,
       multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {


 }
