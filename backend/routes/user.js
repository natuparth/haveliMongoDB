const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User= require('../models/user');


router.get("/getUsers", (req,res,next)=>{
 User.find().then((doc)=>{
   res.status(200).json({
     users: doc
   })
 });

});

router.get("/searchGroup/:groupId", (req,res,next)=>{
  User.find({groupId : req.params.groupId}).then((doc)=>{
    res.status(200).json({users: doc})
  })
});

router.get("/searchMaxGroupId", (req,res,next)=>{
  User.find().sort({groupId:-1}).limit(1).then((doc)=>{
    res.status(200).json({users:doc})
  })
});

router.post("/addUser",(req,res,next)=>{
 bcrypt.hash(req.body.password,10).then((hash)=>{
   const user = new User({
     email : req.body.email,
     password : hash,
     name : req.body.name,
     groupId : req.body.groupId
   });

   user.save().then((result)=>{
     res.status(201).json({
       message: 'user added successfully',
       result : result
     });

   }).catch((err)=>{
     res.json({
       message : 'some error occurred'+err,
        result : err
     });
   })

 });
});

router.post("/login",(req,res,next)=>{
  let fetchedUser;
  User.findOne({
    email: req.body.email
  }).then((user)=>{
    if(!user){
    return  res.status(401).json({
        message: 'user not found'
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password,user.password);
  }).then((result)=>{
      console.log(result);
           if(!result){
          return  res.status(401).json({
              message: 'user not found'
            });
           }
         const token = jwt.sign({email: fetchedUser.email, user_id: fetchedUser._id},"this_is_the_secret_message",{expiresIn: "1h"});
         res.status(200).json({
           token : token,
           message : 'user signed in successfully',
           user : fetchedUser.email.split('.')[0],
           expiresIn: 3600

         })
  }).catch(()=>{
   return res.status(401).json({
       message: 'user not found'
     });

  })

})





module.exports = router;
