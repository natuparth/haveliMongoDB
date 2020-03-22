import { NgModule } from '@angular/core';
import { MainComponent } from './main.component';
import { ExpenseComponent } from './expense/expense.component';
import { SharedModule } from 'src/shared/shared.module';
import { GroceryComponent } from './grocery/grocery.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { CalculateexpenseComponent } from './calculateexpense/calculateexpense.component';
import { MainRouting } from './main-routing.module';


@NgModule({
  declarations : [MainComponent, ExpenseComponent, GroceryComponent, ShoppingListComponent, CalculateexpenseComponent ],
  imports : [SharedModule, MainRouting]
})

export class MainModule {

}
