const express = require('express');
const router = express.Router();

const Item= require('../models/item');

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


    router.get('/getItems',(req,res,next)=>{
      Item.find().then((documents)=>{
      //  console.log(documents);
        res.send(documents);
      })
    });

    router.get('/getItem/:name',(req,res,next)=>{
      Item.find({name:req.params.name}).then((result)=>{
        res.json(result);
      })
    })

    router.delete('/deleteItem/:name',(req,res,next)=>{
      Item.deleteOne({name:req.params.name}).then((result)=>{
      console.log('deleted'+ result);
      });
    //  console.log(req.params.name);
      res.json('deleted');
    });

    router.put('/updateItem/:name',(req,res,next)=>{
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
