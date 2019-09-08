
 var cors = require('cors');


const express = require('express');

const app = express();

const itemRoutes = require('./routes/items');

const authRoutes = require('./routes/user');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://natuparth:natunatu@cluster0-yg5co.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser: true}).then(()=>{
  console.log('connection successfull')
}).catch(()=>{
  console.log('an error occurred')
})


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false }));
app.use(cors());

app.use('/api/item',itemRoutes);
app.use('/api/auth',authRoutes);


 module.exports = app;


