const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
  name: {type:String, required: true},
quantity:Number,
date:Date,
consumptionPerDay:{type:Number,required:false},
price:Number,
imageUrl:{type:String,required: false},

});

module.exports  = mongoose.model('Item', itemSchema);

