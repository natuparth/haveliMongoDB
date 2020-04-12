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
  addDisplay = false;
  editforUser = false;
  updateDisplay = 'none';
  itemList: any = [];
  updateItemList: any = [];
  previousUserId = 0;
  memberListPos = '40%';
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
  addExpenseForm: FormGroup;
  constructor(
    private crudService: CrudService,
    private expenseService: ExpenseService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.memberFlag = false;
    this.welcomeFlag = true;
    this.itemSubject.subscribe(doc => {
      this.itemList = doc;
    });
    console.log('inside expense management component');
    this.GetUsers().then(() => {
    });
    this.addExpenseForm = new FormGroup({});
    //   'purpose': new FormControl('', Validators.required),
    //   'dateOfPurchase': new FormControl(Date.now, Validators.required),
    //   'amount': new FormControl('', Validators.required),
    //   'description': new FormControl(''),
    //   'forWhom' : new FormControl('',Validators.required)
    // });
  }

  openModal(itemId: any, modalName: string) {
    if (modalName == 'addModal') {
      this.addExpenseForm = new FormGroup({
        'purpose': new FormControl('', Validators.required),
        'dateOfPurchase': new FormControl(Date.now, Validators.required),
        'amount': new FormControl('', Validators.required),
        'description': new FormControl(''),
        'forWhom' : new FormControl([],Validators.required)
      });
      for(var i=0; i < this.membersList.length;i++)
      {
        this.addExpenseForm.value.forWhom.push(this.membersList[i].email);
      }
      this.addDisplay = true;
    } else {
      this.updateDisplay = 'block';
      this.UpdateItem(itemId);
    }
  }
  onCloseHandled(name: string) {
    if (name === 'addModal') {
    this.addDisplay = false;
    } else {
      this.updateDisplay = 'none';
    }
  }

  MemberFunction(index: any) {
    this.currentUserId = index;
    console.log('memberfunction id:' + this.currentUserId,this.membersList[index].email);
    this.welcomeFlag = true;
    this.memberFlag = true;
    this.membersList[this.previousUserId].background = false;
    this.membersList[index].background = true;
    this.previousUserId = this.currentUserId;
    this.currentUserName = this.membersList[index].name;
    this.GetUserValues(this.membersList[index].name);
  }

  GetUserValues(id: string) {
    this.itemList = [];
    console.log(id);
    this.expenseService.getExpenses(id).subscribe(doc => {
      console.log(doc);
      this.itemSubject.next(doc);
      this.welcomeFlag = false;
    });
  }
  /*
  GetUsers()
    Functionality:  Fetch deails for all members of the group. Group Id is taken from localstorage.
                    Saves the data of the members in a list. <membersList>
    Returns:        No values are returned from this funcion.
    Inputs:         No input variable
  */
  async GetUsers() {
    this.membersList = [];
    var groupId = localStorage.getItem('groupId');//data strored in string
    console.log("sart");
    if(groupId == 'null')//string comparision => if group id is not assigned pull the user details only 
    {
      this.authService.getUserDetails(localStorage.getItem('userEmail')).subscribe(doc => {
        let count = 0;
        doc.users.forEach(user => {
          this.membersList.push({
            index: count++,
            name: user.name,
            email:  user.email,
            background: false,
            pic:
              '../assets/' + user.name.split(' ')[0].toLocaleLowerCase() + '.jpg'
          });
        });
        this.welcomeFlag = false;
      });
    }
    else{
      this.authService.getUsersByGroupId(groupId.toString()).subscribe(doc => {
        let count = 0;
        doc.users.forEach(user => {
          this.membersList.push({
            index: count++,
            name: user.name,
            email:  user.email,
            background: false,
            pic:
              '../assets/' + user.name.split(' ')[0].toLocaleLowerCase() + '.jpg'
          });
        });
        this.welcomeFlag = false;
      });
    }
  }

  AddItem() {
    this.additemflag = true;
  }
  UpdateItem(itemId: any) {

  }

  updateItem(item: FormControl) {


  }
  /*
  addExpense()
    Functionality:  Add a expense for the specified user.
    Returns:        No values are returned from this funcion.
    Inputs:         Take the form value of Add Expense form.
  */
  addExpense(item: FormGroup) {
    console.log(item.value);
    const expense = {
      purpose: item.value.purpose,
      amount: item.value.amount,
      dateOfPurchase: item.value.dateOfPurchase,
      description: item.value.description,
      forWhom : item.value.forWhom
    };

    this.expenseService.addExpenses(expense,"shubham.shukla").subscribe(response => {
      this.addDisplay = false;
      alert("message"+response.message);
      if (response.message === 'successful') {
        alert('Expense added successfully');
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
  /*
  changeforUser()
    Functionality:  Update the for User list of expense form. A expense user is added or removed based on the select criteria
    Returns:        No values are returned from this funcion.
    Inputs:         take the index of the user.
  */
  changeforUser(index:any){
    var memberemail = this.membersList[index].email;
    if(this.addExpenseForm.value.forWhom.indexOf(memberemail) >=0){
      this.addExpenseForm.value.forWhom.splice(memberemail,1);
    }
    else{
      this.addExpenseForm.value.forWhom.push(memberemail);
    }
  }
  /*
  checkforUser()
    Functionality:  to update the checkbox based on the user is selected or not.
    Returns:        return boolean. True if user is seleced, False if not selected.
    Inputs:         take the index of the user.
  */
  checkforUser(index:any){
    var memberemail = this.membersList[index].email;
    if(this.addExpenseForm.value.forWhom.indexOf(memberemail) >=0){
      return true;
    }
    else{
      return false;
    }
  }
}
