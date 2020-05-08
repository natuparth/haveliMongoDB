const mongoose = require('mongoose');


const globalData = mongoose.Schema({
  latestGroupNumber: Number
})

module.exports = mongoose.model('globalData',globalData,'globalData')
