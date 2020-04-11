const express = require('express');
const router = express.Router();

const Expense= require('../models/expense');
const User  = require('../models/user');
const checkAuth = require('../middleware/check-auth');

router.get("/getExpenses/:id",checkAuth,(req,res,next)=>{
  Expense.find({user: req.params.id}).then((doc)=>{
       res.send(doc);
  })


});

router.post("/addExpenses/:email",checkAuth, (req,res,next)=>{
  console.log("reqbody",req.body);
  const expense = new Expense({
    expenseName : req.body.expenseName,
    amount :  req.body.amount,
    dateOfPurchase : req.body.dateOfPurchase,
    description : req.body.description,
    forWhom : req.body.forWhom
  });
  User.findOne({email : req.params.email},(err,doc)=>{
    doc.expense.push(expense);
    doc.save().then(()=>{
      res.send({message:'successful'});
    }).catch((err)=>{
      res.send({message:'error occurred: '+err})
    });
  });
});
module.exports = router;

