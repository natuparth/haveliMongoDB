const express = require('express');
const router = express.Router();

const Item= require('../models/item');
const group = require('../models/group');
const checkAuth = require('../middleware/check-auth');
router.post("/postItem/:groupId",(req,res,next)=>{
  const item = new Item({
    name : req.body.name,
  quantity:req.body.quantity,
  type: req.body.type,
  measurementUnit: req.body.measurementUnit,
  date:new Date(req.body.date.split('T')[0]),
  consumptionPerDay: req.body.consumptionPerDay,
  price:req.body.price,
  });
  group.findOne({groupId: req.params.groupId},(err,doc)=>{
    doc.items.push(item);
    doc.save().then(()=>{
      res.send({message:'successful'});
    }).catch((err)=>{
      res.send({message: 'error occurred: '+ err})
    });
  });

   });


    router.get('/getItems/:groupId',checkAuth,(req,res,next)=>{
      group.find({groupId : req.params.groupId}).then((documents)=>{
        if(documents[0].items[0]!=null)
        res.send(documents[0].items);
        else
        res.send({message:'items not available!! please add'})
      }).catch((err) =>{
        if(err.message.includes("groupId"))
        res.send({message:'group Id not found'}) 
        else
         res.send({message:'some error occured'+err})
      });
    });

    router.get('/getItem/:name/:groupId',checkAuth,(req,res,next)=>{
      group.findOne({groupId : req.params.groupId}).then((result)=>{
        res.json(result.items.filter(x=> {
          console.log(x);
          return x.name === req.params.name
        }
        ));
      }).catch((e)=>{
        res.json({message: 'some error occured '})
      });
    });

    router.get('/searchItems/:name/:groupId',checkAuth,(req,res,next)=>{
      if(req.params.name == 'all'){
        group.findOne({groupId: req.params.groupId}).then((result)=>{
          console.log(result.items);
          res.send(result.items);
        }).catch((e)=>{
          res.json({message: 'some error occured '})
        });
      }
      else{
      Item.find({name:{$regex: new RegExp(req.params.name)}}).then((result)=>{
        res.send(result);
      }).catch((e)=>{
        res.json({message: 'some error occured '})
      });
    }
    });


    router.delete('/deleteItem',checkAuth,(req,res,next)=>{
        group.findOneAndUpdate({groupId:req.query.gid}, { $pull: { items : {name: req.query.name} }}, (err,doc) => {
              console.log('deleted object'+ doc);
              res.send({message: 'item deleted successfully', name: req.query.name, error: ''})
              if(err)
               res.send({message: "couldn't delete item", name: req.query.name, error: err})
        }).catch((e)=>{
          res.json({message: 'some error occured '})
        });
    });

    router.put('/updateItem/:name/:groupId',checkAuth,(req,res,next)=>{
      req.connection.setTimeout( 1000 * 60 * 10 );
      const item = {
      name : req.body.name,
      quantity:req.body.quantity,
      date:req.body.date,
      consumptionPerDay: req.body.consumptionPerDay,
      price:req.body.price,
      };
      group.updateOne({$and : [{ groupId: req.params.groupId },{ 'items.name': req.params.name}]}, {'$set':{
        'items.$' : item
       }} ,{useFindAndModify: false},function(err,doc) {
        if (err) return res.status(500).send({ error: err , message: 'some Error'});
        return res.send({error: 'no error', message : 'successfully updated the item'});
      }).catch((e)=>{
        res.json({message: 'some error occured '})
      });
    });

module.exports = router;
