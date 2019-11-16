const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User= require('../models/user');


router.post("/addUser",(req,res,next)=>{
 bcrypt.hash(req.body.password,10).then((hash)=>{
   const user = new User({
     email : req.body.email,
     password : hash
   });

   user.save().then((result)=>{
     res.status(201).json({
       message: 'user added successfully',
       result : result
     });

   }).catch((err)=>{
     res.json({
       message : 'some error occurred',
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
