const express = require('express');
const router = express.Router();

const Expense= require('../models/expense');
const checkAuth = require('../middleware/check-auth');

router.get("/getExpenses/:id",checkAuth,(req,res,next)=>{
  Expense.find({user: req.params.id}).then((doc)=>{
       res.send(doc);
  })


});

router.post("/addExpenses",checkAuth, (req,res,next)=>{
  const expense = new Expense({
    user : req.body.user,
    amount: req.body.amount,
    dateOfPurchase: req.body.dateOfPurchase,
    description: req.body.description
  });

  expense.save().then((Message)=>{
     res.status(200).send({message:'item added successfully', error: Message});
  }).catch((errMessage)=>{
    res.status(400).send({message:'failed to add item', error: errMessage});
  })
})
module.exports = router;

