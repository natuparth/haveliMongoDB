import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { config } from 'rxjs';
import { AuthService } from './authService/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'myProject';
constructor(private router: Router, private authservice: AuthService){
  // const db=firebase.firestore();
  // db.settings({timestampsInSnapshots:true});
  // if(authservice.getUserAuthenticated())
  // {
  //   router.navigate(['/main/grocery']);
  // } else {
  //   router.navigate(['/home/login'])
  // }
    console.log('app component instantiated');

}


}


