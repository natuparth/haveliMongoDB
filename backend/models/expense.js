const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
  purpose : {type:String, required: true},
  amount :{type: Number, required: true},
  dateOfPurchase : {type : Date, required: true},
  description : {type : String},
  forWhom : {type:[]},
  groupId : {type:Number}
});

module.exports = mongoose.model("expense", expenseSchema);
