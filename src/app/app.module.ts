import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/shared/shared.module';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { ItemFilterPipe } from './item-filter.pipe';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './Services/authService/auth-interceptor';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    ItemFilterPipe,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
  ],

  providers: [

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
