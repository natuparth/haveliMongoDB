const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
  user : {type:String, required: true},
  amount :{type: Number, required: true},
  dateOfPurchase : {type : Date, required: true},
  description : {type : String, required: true}


});

module.exports = mongoose.model("expenses", expenseSchema);
