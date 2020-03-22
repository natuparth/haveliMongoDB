import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { SharedModule } from 'src/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LoginComponent],
  exports: [LoginComponent],
  imports: [SharedModule,RouterModule.forChild([{ path: '', component: LoginComponent}])]
})

export class AuthModule {



}
