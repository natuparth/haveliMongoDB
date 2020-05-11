const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Group = require('../models/group');


router.get("/getUsers", (req, res, next) => {
  User.find().then((doc) => {
    res.json({
      users: doc
    })
  }).catch((err)=>{
    return res.json({message: 'some error occured!! please try again'});
});

});

router.get("/getUsersByGroupId/:groupId", (req, res, next) => {
  User.find({ groupId: req.params.groupId }).then((doc) => {
    res.json({ users: doc })
  }).catch((err)=>{
    return res.json({message: 'some error occured!! please try again'});
});
});

router.get("/searchGroup/:groupId", (req, res, next) => {
  Group.find({ groupId: req.params.groupId }).then((doc) => {
    res.json({ numberOfUsers: doc.length })
  }).catch((err)=>{
    return res.json({message: 'some error occured!! please try again'});
});
});

router.get("/getUserDetails/:email", (req, res, next) => {
  User.find({ email: req.params.email }).then((doc) => {
    res.json({ users: doc })
  }).catch((err)=>{
    return res.json({message: 'some error occured!! please try again'});
});
});

router.get("/checkEmailExists/:email", (req, res, next) => {
  User.find({ email: req.params.email }).then((doc) => {
    if(doc.length >0)
    res.json(true)
    else
    res.json(false);
  }).catch((err)=>{
    return res.json({message: 'some error occured!! please try again'});
});
});

router.get("/searchMaxGroupId", (req, res, next) => {
  Group.find().sort({ groupId: -1 }).limit(1).
  then((doc) => {
    res.json({ group: doc[0].groupId })
  }).catch((err)=>{
    return res.json({message: 'some error occured!! please try again'});
});
});

router.post("/addUser", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      profilePicId: req.body.profilePicId,
      groupId: req.body.groupId
    });
    User.insertMany(user).then((doc)=>{
      res.json({message:'user added successfully',
                  result:doc})
    }).catch((err)=>{
      res.json({message: 'some error occurred in adding user ' + err,
                result: err})
    });
  });
});


router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({
    email: req.body.email
  }).then((user) => {
    if (!user) {
      return res.json({
        message: 'invalid username'
      });
    }
    fetchedUser = user;
   bcrypt.compare(req.body.password,user.password,(val, same)=>{
     if(same == true){
      const token = jwt.sign({email: fetchedUser.email, user_id: fetchedUser._id},"this_is_the_secret_message",{expiresIn: "1h"});
         res.status(200).json({
           token : token,
           message : 'user signed in successfully',
           userName : fetchedUser.name,
           userEmail : fetchedUser.email,
           groupId : fetchedUser.groupId,
           profilePicId : fetchedUser.profilePicId,
           expiresIn: 3600

         })
     }
     else
     {
      return res.json({
             message: 'invalid password'
          });
     }
   });
  }).catch((err)=>{
        return res.json({message: 'some error occured!! please try again'});
  });

})

router.put("/updateProfile/:email",(req,res,next)=>{
  bcrypt.hash(req.body.password, 10).then((hash) => {
  const profile = new User({
    name : req.body.name,
    email :  req.body.email,
    password : hash,
    groupId : req.body.groupId,
    profilePicId : req.body.profilePicId
  });
  console.log("with password");
  User.updateOne({email : req.params.email},
                  {'$set' : {'name' : profile.name,
                              'password' : profile.password,
                              'groupId' : profile.groupId,
                              'profilePicId' : profile.profilePicId}},
                  {useFindAndModify : false},
                  function(err,doc){
                    if(err) return  res.send({error:err,message:'something went wrong'});
                    return res.send({error : 'none', message : 'successfully updated'});
                  }).catch((err)=>{
                    return res.json({message: 'some error occured!! please try again'});
              });
  });
});

router.put("/updateProfileWithoutpassword/:email",(req,res,next)=>{
  bcrypt.hash(req.body.password, 10).then((hash) => {
  const profile = new User({
    name : req.body.name,
    email :  req.body.email,
    groupId : req.body.groupId,
    profilePicId : req.body.profilePicId
  });
  console.log("without password");
  User.updateOne({email : req.params.email},
                  {'$set' : {'name' : profile.name,
                              'groupId' : profile.groupId,
                              'profilePicId' : profile.profilePicId}},
                  {useFindAndModify : false},
                  function(err,doc){
                    if(err) return  res.send({error:err,message:'something went wrong'});
                    return res.send({error : 'none', message : 'successfully updated'});
                  }).catch((err)=>{
                    return res.json({message: 'some error occured!! please try again'});
              });
  });
});

module.exports = router;
