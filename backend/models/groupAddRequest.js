const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
        for: {type: String, required: true},
        groupId: {type: Number, required: true},
        Status : {type: String, required: true}

});

module.exports = mongoose.model('request', requestSchema, 'requestCollection');
