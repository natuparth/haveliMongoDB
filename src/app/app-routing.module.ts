import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { GroceryComponent } from './main/grocery/grocery.component';
import { ExpenseComponent } from './main/expense/expense.component';
import { HomeComponent } from './home/home.component';
import { ShoppingListComponent } from './main/shopping-list/shopping-list.component';
import { MilkComponent } from './main/milk/milk.component';
import { TestComponent } from './test/test.component';
import { LoginComponent } from './login/login.component';
import { CalculateexpenseComponent } from './main/calculateexpense/calculateexpense.component';
import { AuthGuard } from './authService/authguard.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'test', component: TestComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: LoginComponent
      },
      {
        path: 'login',
        component: LoginComponent
      }

    ]
  },
  {
    path: 'main',
    component: MainComponent,
    children: [
      {
        path: 'calculate',
        component: CalculateexpenseComponent
      },
      {
        path: 'grocery',
        component: GroceryComponent
      },
      { path: 'test', component: TestComponent },
      {
        path: 'expense',
        component: ExpenseComponent
      },
      {
        path: 'shopping',
        component: ShoppingListComponent
      },
      {
        path: 'milk',
        component: MilkComponent
      },
      {
        path: 'calculate',
        component: CalculateexpenseComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
