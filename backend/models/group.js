const mongoose = require('mongoose');
const Item = require('./item').schema;
const uniqueValidator = require('mongoose-unique-validator');
const groupSchema = mongoose.Schema({
  groupId : { type : String, required: true, unique: true},
  items : [Item]

});

groupSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Group',groupSchema);
