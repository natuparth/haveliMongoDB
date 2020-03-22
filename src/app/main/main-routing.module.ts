import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { CalculateexpenseComponent } from './calculateexpense/calculateexpense.component';
import { GroceryComponent } from './grocery/grocery.component';
import { ExpenseComponent } from './expense/expense.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { NgModule } from '@angular/core';


const routes: Routes = [
  {
    path: '',
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
      {
        path: 'expense',
        component: ExpenseComponent
      },
      {
        path: 'shopping',
        component: ShoppingListComponent
      },
      {
        path: 'calculate',
        component: CalculateexpenseComponent
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MainRouting {

}
