import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/Services/crudService/crud.service';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ExpenseService } from 'src/app/Services/expenseService/expense-service.service';
import { AuthService } from 'src/app/Services/authService/auth.service';
import { Users } from 'src/app/models/users.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
  membersList: any[] = [];
  itemSubject = new Subject<any>();
  memberFlag = false;
  addDisplay = 'none';
  updateDisplay = 'none';
  itemList: any = [];
  updateItemList: any = [];
  previousUserId = 0;
  memberListTranslate: any = [];
  memberListPos = '40%';
  memberListTranslatePos = -165;
  currentUserId = -1;
  currentUserName = '';
  welcomeFlag = true;
  sideBarExpand = true;
  additemflag = false;
  updateitemflag = false;
  updateItemForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    dateOfPurchase: new FormControl(Date.now, Validators.required),
    price: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required)
  });
  addItemForm: FormGroup;
  constructor(
    private crudService: CrudService,
    private expenseService: ExpenseService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.memberFlag = false;
    this.itemSubject.subscribe(doc => {
      this.itemList = doc;
    });
    console.log('inside expense management component');
    this.GetUsers().then(() => {
      this.welcomeFlag = false;
    });
    console.log(this.membersList.length);
    this.addItemForm = new FormGroup({
      name: new FormControl('', Validators.required),
      dateOfPurchase: new FormControl(Date.now, Validators.required),
      price: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required)
    });
  }

  openModal(itemId: any, modalName: string) {
    if (modalName == 'addModal') {
      this.addDisplay = 'block';
    } else {
      this.updateDisplay = 'block';
      this.UpdateItem(itemId);
    }
  }
  onCloseHandled(name: string) {
    if (name === 'addModal') {
    this.addDisplay = 'none';
    } else {
      this.updateDisplay = 'none';
    }
  }

  MemberFunction(index: any) {
    this.currentUserId = index;
    console.log('memberfunction id:' + this.currentUserId);
    this.welcomeFlag = false;
    this.memberFlag = true;
    this.membersList[this.previousUserId].background = false;
    this.membersList[index].background = true;
    this.previousUserId = this.currentUserId;
    this.currentUserName = this.membersList[index].name;
    this.GetUserValues(this.membersList[index].name);
    //   }
  }

  GetUserValues(id: string) {
    this.itemList = [];
    console.log(id);
    this.expenseService.getExpenses(id).subscribe(doc => {
      console.log(doc);
      this.itemSubject.next(doc);
    });
  }

  async GetUsers() {
    this.membersList = [];
    this.authService.getUsers().subscribe(doc => {
      console.log(doc.users.length);
      let count = 0;
      doc.users.forEach(user => {
        this.membersList.push({
          index: count++,
          name: user.name,
          background: false,
          pic:
            '../assets/' + user.name.split(' ')[0].toLocaleLowerCase() + '.jpg'
        });
        this.memberListTranslate.push(
          'translate(' + (this.memberListTranslatePos + count * 55) + 'px,0px)'
        );
      });
      console.log(this.membersList);
    });
  }

  AddItem() {
    this.additemflag = true;
  }
  UpdateItem(itemId: any) {

  }

  updateItem(item: FormControl) {


  }
  addItemSubmit(item: FormGroup) {
    console.log(item.value);
    const expense = {
      user: this.currentUserName,
      amount: item.value.price,
      dateOfPurchase: item.value.dateOfPurchase,
      description: item.value.name
    };

    this.expenseService.addExpenses(expense).subscribe(response => {
      this.addDisplay = 'none';

      if (response.message == 'item added successfully') {
        alert('item added successfully');
        this.itemList.push(expense);
        this.itemSubject.next([...this.itemList]);
      } else {
        alert(
          'some error occurred while adding the expense. Error: ' +
            response.errMessage
        );
      }
    });
  }
}
