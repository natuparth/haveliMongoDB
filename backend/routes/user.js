const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Group = require('../models/group');
const globalData = require('../models/globalData');
const Request = require('../models/groupAddRequest');
const nodemailer = require("nodemailer");
const checkAuth = require('../middleware/check-auth');


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
           groups : fetchedUser.groups,
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

router.put("/updateProfile/:email",checkAuth,(req,res,next)=>{
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

router.put("/updatePassword",(req,res,next)=>{
  bcrypt.hash(req.body.password, 10).then((hash) => {
  const profile = new User({
    email :  req.body.email,
    password : hash
  });
  User.updateOne({email : profile.email},
                  {'$set' : { 'password' : profile.password}},
                  {useFindAndModify : false},
                  function(err,doc){
                    if(err) return  res.status(500).send({error:err,message:'something went wrong'});
                    return res.send({error : 'none', message : 'successfully updated'});
                  })
  });
});

router.put("/updateProfileWithoutpassword/:email", checkAuth,(req,res,next)=>{
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


router.post("/sendOtp", (req, res,next) => {
  // console.log("request came",req.body);
  let user = req.body;
  sendOtpByMail(user, info => {
    // res.send(info);
    return res.json({
      message: 'Mail sent successfully'
    });
  }).catch((err)=>{
    // console.log('err',err)
    return res.json({
      message: 'some error occured!! please try again'
    });
  });
});

router.post("/sendMessage", (req, res,next) => {
  // console.log("request came",req.body);
  let user = req.body;
  sendMessageByMail(user, info => {
    // console.log(info)
    // res.send(info);
    return res.json({
      message: 'Mail sent successfully'
    });
  }).catch((err)=>{
    // console.log('err',err)
    return res.json({
      message: 'some error occured!! please try again'
    });
  });
});

async function sendOtpByMail(user,callback) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: 'rahultest10111@gmail.com',
      pass: 'rahultest@135'
    }
  });

  let mailOptions = {
    from: '"HMS Team"<example.gimail.com>',
    to: user.email,
    subject: "Welcome to HMS",
    html: `<h1>Hi ${user.name}</h1><br>
    <h4>Your OTP </h4><h1>${user.otp}</h1><br>
    <h4>Thanks for joining us</h4>`
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  callback(info);
}

async function sendMessageByMail(user,callback) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: 'rahultest10111@gmail.com',
      pass: 'rahultest@135'
    }
  });
  // console.log(user)
  let mailOptions = {
    from: '"HMS Team"<example.gmail.com>',
    to: user.email,
    subject: user.subject,
    html: `<h3>${user.message}</h3><br>
    <h2>Thank You</h2>`
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  callback(info);
}

module.exports = router;
