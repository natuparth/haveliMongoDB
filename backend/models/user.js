const mongoose = require('mongoose');
const expense = require('./expense').schema;
const uniqueValidator = require('mongoose-unique-validator');
const userSchema = mongoose.Schema({
  email : { type : String , required: true , unique: true},
  password : { type : String , required : true},
  name : { type : String , required : true},
  profilePicId : { type : Number },
  groups : [Number],
  expenses: [expense],
},
{
  versionKey: false // You should be aware of the outcome after set to false
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User',userSchema);
