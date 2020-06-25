const mongoose = require('mongoose');
const expense = require('./expense').schema;
const expenseHistorySchema = mongoose.Schema({
    modifyType:{type:String},
    modifyDate:{type:Date},
    modifyBy:{type:String},
    paidBy:{type:String},
    purpose : {type:String},
   amount :{type: Number},
   dateOfPurchase : {type : Date},
   description : {type : String},
    forWhom : {type:[]},
});

module.exports = mongoose.model("expenseHistory", expenseHistorySchema);