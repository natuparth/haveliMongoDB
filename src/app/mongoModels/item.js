const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({

  name :{
     type : String,
     required : true
   },
   consumptionPerDay : {
     type : Number,
     required : true

   },
   dateOfLastPurchase : {
    type : String,
    required : true

  },
   quantity : {
     type : Number,
     required: true
   }
},{collection: 'Item'});

var Item=module.exports = mongoose.model('Item',itemSchema);
