const express = require('express');
const router = express.Router();

const Item= require('../models/item');
const checkAuth = require('../middleware/check-auth');
router.post("/postItem",(req,res,next)=>{
  const item = new Item({
    name : req.body.name,
  quantity:req.body.quantity,
  date:new Date(req.body.date.split('T')[0]),
  consumptionPerDay: req.body.consumptionPerDay,
  price:req.body.price,
  });
  console.log(item);
  item.save()
  res.send({message:'successful'});
   });


    router.get('/getItems',checkAuth,(req,res,next)=>{
      Item.find().then((documents)=>{
      //  console.log(documents);
        res.send(documents);
      })
    });

    router.get('/getItem/:name',checkAuth,(req,res,next)=>{
      Item.find({name:req.params.name}).then((result)=>{
        res.json(result);
      })
    });

    router.get('/searchItems/:name',checkAuth,(req,res,next)=>{
      if(req.params.name == 'all'){
        console.log('inside all part');
        Item.find().then((result)=>{
          res.send(result);
        })
      }
      else{
      Item.find({name:{$regex: new RegExp(req.params.name)}}).then((result)=>{
        res.send(result);
      })
    }
    });


    router.delete('/deleteItem/:name',checkAuth,(req,res,next)=>{
      Item.deleteOne({name:req.params.name}).then((result)=>{
      console.log('deleted'+ result);
      });
    //  console.log(req.params.name);
      res.json('deleted');
    });

    router.put('/updateItem/:name',checkAuth,(req,res,next)=>{
      req.connection.setTimeout( 1000 * 60 * 10 );
      Item.find({name:req.params.name}).then((result)=>{
      console.log(result[0]._id);
      const item = {
      name : req.body.name,
      quantity:req.body.quantity,
      date:req.body.date,
      consumptionPerDay: req.body.consumptionPerDay,
      price:req.body.price,
      };
      Item.updateOne({ _id: result[0]._id}, item ,{useFindAndModify: false},function(err,doc) {
        if (err) return res.status(500).send({ error: err , message: 'some Error'});
        return res.send({error: 'no error', message : 'successfully updated the item'});
      })
    });
    });

module.exports = router;
