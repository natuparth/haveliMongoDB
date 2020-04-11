const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
  expenseName : {type:String, required: true},
  amount :{type: Number, required: true},
  dateOfPurchase : {type : Date, required: true},
  description : {type : String, required: true},
  forWhom : [String]
});

module.exports = mongoose.model("expense", expenseSchema);
