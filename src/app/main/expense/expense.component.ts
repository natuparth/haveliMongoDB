import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CrudService } from 'src/app/Services/crudService/crud.service';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ExpenseService } from 'src/app/Services/expenseService/expense-service.service';
import { AuthService } from 'src/app/Services/authService/auth.service';
import { Users } from 'src/app/models/users.model';
import { Subject } from 'rxjs';
import { GroupService } from 'src/app/Services/groupService/group.service';
// import { DatePipe } from '@angular/common';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
  membersList: any[] = [];
  filterOptionList: any[] = ['All','This Week','This Month','Custom Dates'];
  itemSubject = new Subject<any>();
  memberFlag = false;
  addDisplay = false;
  updateDisplay = false;
  itemList: any = [];
  filteredItemList: any = [];
  updateItemList: any = [];
  memberListPos = '40%';
  currentUserName = '';
  currentUserEmail = '';
  welcomeFlag = true;
  sideBarExpand = true;
  updateitemflag = false;
  expenseGraphToggle = false;
  expenseDetailsToggle = false;
  errMessage: String;
  errFlag: Boolean = false;
  graphDataColumns: any[];
  updateExpenseForm: FormGroup;
  addExpenseForm: FormGroup;
  groupId: string = null;
  prevExpense:any;
  dateFilterForm: FormGroup;
  custuomDatesFlag: boolean = false;
  constructor(
    private crudService: CrudService,
    private expenseService: ExpenseService,
    private authService: AuthService,
    private groupService: GroupService,
  ) {}

  ngOnInit() {
    this.groupId = localStorage.getItem('groupId');
    this.memberFlag = false;
    this.welcomeFlag = true;
    this.itemSubject.subscribe(doc => {
      this.itemList = doc;
    });
    // console.log('inside expense management component');
    this.GetUsers().then(() => {
    });
    this.addExpenseForm = new FormGroup({});
    this.updateExpenseForm = new FormGroup({});
    this.dateFilterForm = new FormGroup({
      'dateStart': new FormControl(new Date, Validators.required),
      'dateEnd': new FormControl(new Date, Validators.required)
    })
  }
  /*
  openModal()
    Functionality:  open the selected model
    Returns:        No values are returned from this funcion.
    Inputs:         itemId:
                    modalName:  Name of the modal to be displayed
  */
  openModal(expense: any, modalName: string) {
    this.prevExpense=expense;
    if (modalName === 'addModal') {
      this.addExpenseForm = new FormGroup({
        'purpose': new FormControl('', Validators.required),
        'dateOfPurchase': new FormControl(Date.now, Validators.required),
        'amount': new FormControl('', Validators.required),
        'description': new FormControl(''),
        'forWhom' : new FormControl([], Validators.required),
      });
      for (let i = 0; i < this.membersList.length; i++) {
        this.addExpenseForm.value.forWhom.push(this.membersList[i].email);
      }
      this.addDisplay = true;
    } else {
      this.updateExpenseForm = new FormGroup({
        'purpose' : new FormControl(expense.purpose, Validators.required),
        'dateOfPurchase': new FormControl(expense.dateOfPurchase, Validators.required),
        'amount': new FormControl(expense.amount, Validators.required),
        'description': new FormControl(expense.description),
        'forWhom' : new FormControl(expense.forWhom, Validators.required),
        'expenseId' : new FormControl(expense._id, Validators.required)
      });
      this.updateDisplay = true;
    }
  }
  /*
  onCloseHandled()
    Functionality:  close the selected model
    Returns:        No values are returned from this funcion.
    Inputs:         modalName:  Name of the modal to be displayed
  */
  onCloseHandled(name: string) {
    if (name === 'addModal') {
    this.addDisplay = false;
    } else {
      this.updateDisplay = false;
    }
  }
  /*
  MemberFunction()
    Functionality:  To fetch the current user for expense component.
    Returns:        No values are returned from this funcion.
    Inputs:         Index of MemberList and type of function to be executed name/email
                    name: calls the getexpense function
                    email:  sets the current user-email
  */
  MemberFunction(index: any, type: String) {
    this.memberFlag = true;
    this.currentUserName = this.membersList[index].name;
    this.currentUserEmail = this.membersList[index].email;
    if (type === 'name') {
      this.GetUserValues(this.membersList[index].email);
    }
  }
  /*
  GetUserValues()
    Functionality:  To fetch the expense for selected user.
    Returns:        No values are returned from this funcion.
    Inputs:         email:  email of the selected user
  */
  GetUserValues(email: string) {
    this.expenseGraphToggle = false;
    this.welcomeFlag = true;
    this.itemList = [];
    this.errFlag = false;
    let groupId = localStorage.getItem('groupId');
    this.expenseService.getExpenses(email,groupId).subscribe(doc => {
      this.itemSubject.next(doc);
      if (this.crudService.getItemListKey(this.itemList) !='') {
      this.errMessage = this.crudService.getItemListKey(this.itemList);
      this.errFlag = true;
    } else {
      this.graphDataColumns = ['purpose', 'amount'];
      this.expenseGraphToggle = this.itemList.length > 0;
      this.expenseDetailsToggle = false;
      this.filteredItemList = this.itemList;
      
    }
      this.welcomeFlag = false;
      console.log(this.itemList);
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
     // data strored in string

    // console.log("sart",groupId);
    if (this.groupId == 'undefined') {
      this.groupService.getUserDetails(localStorage.getItem('userEmail')).subscribe(doc => {
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
    } else {
      this.groupService.getUsersByGroupId(Number(this.groupId)).subscribe(doc => {
        let count = 0;
        // console.log('users',doc);
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
  /*
  updateItem()
    Functionality:  Update a expense for the specified user.
    Returns:        No values are returned from this funcion.
    Inputs:         Take the form value of Add Expense form.
  */
  updateExpense(expensedata: FormControl) {
    let groupId = localStorage.getItem('groupId');
    const expense = {
      purpose: expensedata.value.purpose,
      amount: expensedata.value.amount,
      dateOfPurchase: expensedata.value.dateOfPurchase,
      description: expensedata.value.description,
      forWhom : expensedata.value.forWhom,
      groupId : +groupId
    };
    let expenseId = expensedata.value.expenseId;
    
    this.expenseService.updateExpense(expense, this.currentUserEmail, expenseId).subscribe(response => {
      if (response.message === 'successfully updated') {
        this.expenseService.addExpenseHistory(this.currentUserEmail,"U",this.prevExpense);
        alert('Expense successfully updated');
      } else {
        alert('some error occurred while adding the expense. Error: ' +
        response.error);
      }
      this.onCloseHandled('updateModal');
      this.GetUserValues(this.currentUserEmail);
    });
  }
  /*
  addExpense()
    Functionality:  Add a expense for the specified user.
    Returns:        No values are returned from this funcion.
    Inputs:         Take the form value of Add Expense form.
  */
  addExpense(item: FormGroup) {
    const expense = {
      purpose: item.value.purpose,
      amount: item.value.amount,
      dateOfPurchase: item.value.dateOfPurchase,
      description: item.value.description,
      forWhom : item.value.forWhom,
      groupId : Number(this.groupId)
    };

    
    this.expenseService.addExpenses(expense, this.currentUserEmail).subscribe(response => {
      this.onCloseHandled('addModal');
      this.expenseService.addExpenseHistory(this.currentUserEmail,"A",null);
      if (response.message === 'successful') {
        alert('Expense added successfully');
        if (this.itemList.length === undefined) {
              this.itemList=[];
        }
        this.itemList.push(expense);
        this.itemSubject.next([...this.itemList]);
        this.GetUserValues(this.currentUserEmail);
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
    Inputs:         index:take the index of the user.
                    modalName:take the modal name for which the operation to be executed
  */
  changeforUser(index: any, modalName: String) {
    if (modalName === 'addExpense') {
      let memberemail = this.membersList[index].email;
      let memberIndex = this.addExpenseForm.value.forWhom.indexOf(memberemail);
      if (memberIndex >= 0) {
        this.addExpenseForm.value.forWhom.splice(memberIndex, 1);
      } else {
        this.addExpenseForm.value.forWhom.push(memberemail);
      }
    } else {
      let memberemail = this.membersList[index].email;
      let memberIndex = this.updateExpenseForm.value.forWhom.indexOf(memberemail);
      if (memberIndex >= 0) {
        this.updateExpenseForm.value.forWhom.splice(memberIndex, 1);
      } else {
        this.updateExpenseForm.value.forWhom.push(memberemail);
      }
    }

  }
  /*
  checkforUser()
    Functionality:  to update the checkbox based on the user is selected or not.
    Returns:        return boolean. True if user is seleced, False if not selected.
    Inputs:         index:take the index of the user.
                    modalName:take the modal name for which the operation to be executed
  */
  deleteExpense(expense: any) {
    console.log('expense');
    if (confirm('Are you sure you want to remove ' + expense.purpose + ' expense')) {
      
      this.expenseService.deleteExpense(this.currentUserEmail, expense).subscribe(response => {
        if (response.message === 'successfully deleted') {
          this.expenseService.addExpenseHistory(this.currentUserEmail,"D",expense);
          alert('Expense successfully deleted');
        } else {
          alert('some error occurred while adding the expense. Error: ');
        }
        this.GetUserValues(this.currentUserEmail);
      });
      }
  }
  /*
  checkforUser()
    Functionality:  to update the checkbox based on the user is selected or not.
    Returns:        return boolean. True if user is seleced, False if not selected.
    Inputs:         index:take the index of the user.
                    modalName:take the modal name for which the operation to be executed
  */
  checkforUser(index: any, modalName: String) {
    if (modalName === 'addExpense') {
      let memberemail = this.membersList[index].email;
      let memberIndex = this.addExpenseForm.value.forWhom.indexOf(memberemail);
      if (memberIndex >= 0) {
        return true;
      } else {
        return false;
      }
    } else {
      let memberemail = this.membersList[index].email;
      let memberIndex = this.updateExpenseForm.value.forWhom.indexOf(memberemail);
      if (memberIndex >= 0) {
        return true;
      } else {
        return false;
      }
    }
  }
  /*
  filterExpense()
    Functionality:  to update the list of expense as per the dates selected.
                    Options are filterOptionList.
    Returns:        returns filtered expenses with in date range
    Inputs:         options:  type of filter
  */
  filterExpense(option : string){
    let optionNo = this.filterOptionList.indexOf(option);
    let dateStart = new Date();
    let dateEnd = new Date();
    //formatDate(new Date(), 'yyyy/MM/dd', 'en')
    switch (optionNo) {
      case 1:
        dateStart.setDate(dateStart.getDate() - 7);
        this.dateFilterForm.value.dateStart = dateStart;
        this.applyDateFilter();
        break;
      case 2:
        dateStart.setDate(dateStart.getDate() - 30);
        this.dateFilterForm.value.dateStart = dateStart;
        this.applyDateFilter();
        break;
      case 3:
        console.log('custom is selected');
        this.custuomDatesFlag = true;
        break;
      default:
        this.filteredItemList = this.itemList;
        console.log('All expense');
        break;
    }
  }
  /*
  chooseCustomDate()
    Functionality:  to update the list of expense as per the dates selected.
                    Options are filterOptionList.
    Returns:        returns filtered expenses with in date range
    Inputs:         options:  type of filter
  */
  chooseCustomDate(){
    console.log('customdates selectfunction called',this.dateFilterForm.value);
    this.applyDateFilter();
    this.custuomDatesFlag = false;
  }
  /*
  applyDateFilter()
    Functionality:  to update the list of expense as per the dates selected.
                    Options are filterOptionList.
    Returns:        returns filtered expenses with in date range
    Inputs:         options:  type of filter
  */
  applyDateFilter(){
    let dateStart = new Date(this.dateFilterForm.value.dateStart);
    let dateEnd = new Date(this.dateFilterForm.value.dateEnd);
    this.filteredItemList = this.itemList.filter(items => new Date(items.dateOfPurchase) >= dateStart && new Date(items.dateOfPurchase) <= dateEnd);
    console.log(dateStart,dateEnd,this.filteredItemList);
  }
}
