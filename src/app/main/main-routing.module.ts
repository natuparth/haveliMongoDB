import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { CalculateexpenseComponent } from './calculateexpense/calculateexpense.component';
import { GroceryComponent } from './grocery/grocery.component';
import { ExpenseComponent } from './expense/expense.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { ProfileLogoComponent } from './profile/profile-logo/profile-logo.component';
import { DoughnutComponent } from './graphs/doughnut/doughnut.component';
import { HomeComponent } from '../home/home.component';


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
        path: 'calculate',
        component: CalculateexpenseComponent
      },
      {
        path: 'profile',
        component:  ProfileComponent
      },
      {
        path: 'profilelogo',
        component:  ProfileLogoComponent
      },
      {
        path: 'doughnut',
        component:  DoughnutComponent
      },
      {
        path : 'home' ,
        component: HomeComponent
      },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MainRouting {

}
