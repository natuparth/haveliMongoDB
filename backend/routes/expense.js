const express = require('express');
const router = express.Router();

const Expense= require('../models/expense');
const ExpenseHistory= require('../models/expenseHistory');
const User  = require('../models/user');
const Group  = require('../models/group');
const checkAuth = require('../middleware/check-auth');

router.post("/addExpenseHistory/:groupId",checkAuth, (req,res,next)=>{

  if(req.body.expense==null){
    const expenseHistory = new ExpenseHistory({
      modifyType:req.body.modifyType,
      modifyDate:req.body.modifyDate,
      modifyBy:req.body.modifyBy,
      paidBy:req.body.paidBy,
    });
    Group.findOne({groupId : req.params.groupId},(err,doc)=>{
      doc.expHistory.push(expenseHistory)
      doc.save().then(()=>{
        res.send({message:'successful'});
      }).catch((err)=>{
        console.log(err)
        res.send({message:'error occurred: '+err})
      });
    });
  }
  else{
  const expenseHistory = new ExpenseHistory({
    modifyType:req.body.modifyType,
    modifyDate:req.body.modifyDate,
    modifyBy:req.body.modifyBy,
    paidBy:req.body.paidBy,
    purpose : req.body.expense.purpose,
    amount :req.body.expense.amount,
    dateOfPurchase : req.body.expense.dateOfPurchase,
    description :req.body.expense.description,
    forWhom : req.body.expense.forWhom,
  });
  Group.findOne({groupId : req.params.groupId},(err,doc)=>{
    doc.expHistory.push(expenseHistory)
    doc.save().then(()=>{
      res.send({message:'successful'});
    }).catch((err)=>{
      console.log(err)
      res.send({message:'error occurred: '+err})
    });
  });
}
  
});

router.get("/getExpensehistory/:groupId",checkAuth,(req,res,next)=>{
  Group.find({groupId: req.params.groupId}).then((doc)=>{
      if(doc[0].expHistory[0]!=null)
       res.send(doc[0].expHistory);
       else
       res.send({message:"you have no Expense HIstory yet!!"});
  }).catch((e)=>{
    res.json({message: 'error occured '});
  });
});

router.get("/getExpenses/:email",checkAuth,(req,res,next)=>{
  User.find({email: req.params.email}).then((doc)=>{
      if(doc[0].expenses[0]!=null)
       res.send(doc[0].expenses);
       else
       res.send({message:"you have no Expenses yet!!"});
  }).catch((e)=>{
    res.json({message: 'error occured '});
  });
});

 
router.post("/addExpenses/:email",checkAuth, (req,res,next)=>{
  console.log("reqbody",req.body);
  const expense = new Expense({
    purpose : req.body.purpose,
    amount :  req.body.amount,
    dateOfPurchase : req.body.dateOfPurchase,
    description : req.body.description,
    forWhom : req.body.forWhom,
    groupId : req.body.groupId
  });
  User.findOne({email : req.params.email},(err,doc)=>{
    doc.expenses.push(expense);
    doc.save().then(()=>{
      res.send({message:'successful'});
    }).catch((err)=>{
      console.log(err)
      res.send({message:'error occurred: '+err})
    });
  });
});

router.put("/updateExpense/:email/:_id",checkAuth,(req,res,next)=>{
  const expense = new Expense({
    purpose : req.body.purpose,
    amount :  req.body.amount,
    dateOfPurchase : req.body.dateOfPurchase,
    description : req.body.description,
    forWhom : req.body.forWhom
  });
  User.updateOne({$and : [{email : req.params.email},{'expenses._id' : req.params._id}]},
                  {'$set' : {'expenses.$' : expense}},
                  {useFindAndModify : false},
                  function(err,doc){
                    if(err) return  res.status(500).send({error:err,message:'something went wrong'});
                    return res.send({error : 'none', message : 'successfully updated'});
                  }).catch((err)=>{
                    return res.json({message: 'some error occured!! please try again'});
              });
});

router.delete('/deleteExpense',checkAuth,(req,res,next)=>{
  User.findOneAndUpdate(  {email : req.query.email},
                          {$pull : { expenses : { _id: req.query._id}}},
                          function(err,doc){
                            if(err) return  res.status(500).send({error:err,message:'something went wrong'});
                        
                            return res.send({error : 'none', message : 'successfully deleted'});
                          }).catch((err)=>{
                            return res.json({message: 'some error occured!! please try again'});
                      });
});
module.exports = router;

