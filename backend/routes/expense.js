const express = require('express');
const router = express.Router();

const Expense= require('../models/expense');
const User  = require('../models/user');
const checkAuth = require('../middleware/check-auth');

// router.get("/getExpenses/:email",checkAuth,(req,res,next)=>{
//   User.find({email: req.params.email}).then((doc)=>{
//       if(doc[0].expenses[0]!=null)
//        res.send(doc[0].expenses);
//        else
//        res.send({message:"you have no Expenses yet!!"});
//   }).catch((e)=>{
//     res.json({message: 'error occured '});
//   });
// });

router.get("/getExpenses/:email/:groupId",checkAuth,(req,res,next)=>{
 console.log(req.params.email,req.params.groupId);
  User.aggregate([
    { $match : {'email' : req.params.email} },
    { $project : {  expenses: {
         $filter: {
            input: "$expenses",
            as: "expense",
            cond: { $eq: [ "$$expense.groupId", +req.params.groupId ]  }
          }
        }, _id:1
      }
    },
    // { $project : {'expenses':1,_id:1}},
    { $unwind: '$expenses'},
    { $sort : { 'expenses.dateOfPurchase' :-1}},
    {
      "$group": {
        "_id": "$_id",
        "expenses": {
          "$push": "$expenses"
        }
      }
    }
  
    ],
  (err, doc)=>{
    console.log(doc)
    if(err)
      res.json({message: 'error occured '});
    else{
      if(doc.length)
        res.send(doc[0].expenses);
      else
      res.send({message:"you have no Expenses yet!!"});
    }
  }).catch((e)=>{
    console.log('err'+e)
    res.json({message: 'error occured '+e});
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

