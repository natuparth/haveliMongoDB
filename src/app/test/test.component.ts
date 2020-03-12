import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/crudService/crud.service';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(private crudService:CrudService) { }

  ngOnInit() {
  }
  
}


