const mongoose = require('mongoose');
const Item = require('./item').schema;
const expenseHistory = require('./expenseHistory').schema;
const uniqueValidator = require('mongoose-unique-validator');
const groupSchema = mongoose.Schema({
  groupId : { type : Number, required: true, unique: true},
  groupName : { type : String, required: true},
  items : [Item],
  expHistory : [expenseHistory]

});

groupSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Group',groupSchema);
