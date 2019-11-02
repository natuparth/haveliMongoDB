import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { config } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'myProject';
constructor(private router:Router){
  // const db=firebase.firestore();
  // db.settings({timestampsInSnapshots:true});
  router.navigate(['/home/login'])
}


}


