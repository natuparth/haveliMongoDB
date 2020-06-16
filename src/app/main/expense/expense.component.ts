import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/Services/crudService/crud.service';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ExpenseService } from 'src/app/Services/expenseService/expense-service.service';
import { AuthService } from 'src/app/Services/authService/auth.service';
import { Users } from 'src/app/models/users.model';
import { Subject } from 'rxjs';
import { GroupService } from 'src/app/Services/groupService/group.service';

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
  updateDisplay = false;
  itemList: any = [];
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
  constructor(
    private crudService: CrudService,
    private expenseService: ExpenseService,
    private authService: AuthService,
    private groupService: GroupService
  ) {}

  ngOnInit() {
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
  }
  /*
  openModal()
    Functionality:  open the selected model
    Returns:        No values are returned from this funcion.
    Inputs:         itemId:
                    modalName:  Name of the modal to be displayed
  */
  openModal(expense: any, modalName: string) {
    if (modalName === 'addModal') {
      this.addExpenseForm = new FormGroup({
        'purpose': new FormControl('', Validators.required),
        'dateOfPurchase': new FormControl(Date.now, Validators.required),
        'amount': new FormControl('', Validators.required),
        'description': new FormControl(''),
        'forWhom' : new FormControl([], Validators.required)
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
    this.expenseService.getExpenses(email).subscribe(doc => {
      this.itemSubject.next(doc);
      if (this.crudService.getItemListKey(this.itemList) !='') {
      this.errMessage = this.crudService.getItemListKey(this.itemList);
      this.errFlag = true;
    } else {
      this.graphDataColumns = ['purpose', 'amount'];
      this.expenseGraphToggle = this.itemList.length > 0;
      this.expenseDetailsToggle = false;

    }
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
    let groupId = localStorage.getItem('groupId'); // data strored in string

    // console.log("sart",groupId);
    if (groupId == 'undefined') {
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
      this.groupService.getUsersByGroupId(Number(groupId)).subscribe(doc => {
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
    const expense = {
      purpose: expensedata.value.purpose,
      amount: expensedata.value.amount,
      dateOfPurchase: expensedata.value.dateOfPurchase,
      description: expensedata.value.description,
      forWhom : expensedata.value.forWhom
    };
    let expenseId = expensedata.value.expenseId;
    this.expenseService.updateExpense(expense, this.currentUserEmail, expenseId).subscribe(response => {
      if (response.message === 'successfully updated') {
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
      groupId : +this.groupId
    };

    this.expenseService.addExpenses(expense, this.currentUserEmail).subscribe(response => {
      this.onCloseHandled('addModal');
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
    console.log('delete');
    if (confirm('Are you sure you want to remove ' + expense.purpose + ' expense')) {
      this.expenseService.deleteExpense(this.currentUserEmail, expense._id).subscribe(response => {
        if (response.message === 'successfully deleted') {
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
}
