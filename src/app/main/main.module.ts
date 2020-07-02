import { NgModule } from '@angular/core';
import { MainComponent } from './main.component';
import { ExpenseComponent } from './expense/expense.component';
import { SharedModule } from 'src/shared/shared.module';
import { GroceryComponent } from './grocery/grocery.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { CalculateexpenseComponent } from './calculateexpense/calculateexpense.component';
import { MainRouting } from './main-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ProfileLogoComponent } from './profile/profile-logo/profile-logo.component';
import { DoughnutComponent } from './graphs/doughnut/doughnut.component';
import { HomeComponent } from '../home/home.component';
import { MatCardModule } from '@angular/material/card';
import { NotificationComponent } from './notification/notification.component';
import { AgGridModule } from 'ag-grid-angular';
import { GroupdashboardComponent } from './groupdashboard/groupdashboard.component';
import { SplitexpenseComponent } from './groupdashboard/splitexpense/splitexpense.component';



@NgModule({
  declarations : [MainComponent, ExpenseComponent, GroceryComponent,
    ShoppingListComponent, CalculateexpenseComponent, ProfileComponent,
    ProfileLogoComponent, DoughnutComponent, HomeComponent, NotificationComponent, GroupdashboardComponent, SplitexpenseComponent],
  imports : [SharedModule, MainRouting, MatCardModule, AgGridModule ]
})

export class MainModule {

}
