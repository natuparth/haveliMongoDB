const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Group = require('../models/group');
const nodemailer = require("nodemailer");


router.get("/getUsers", (req, res, next) => {
  User.find().then((doc) => {
    res.status(200).json({
      users: doc
    })
  });

});

router.get("/getUsersByGroupId/:groupId", (req, res, next) => {
  User.find({ groupId: req.params.groupId }).then((doc) => {
    res.status(200).json({ users: doc })
  })
});

router.get("/searchGroup/:groupId", (req, res, next) => {
  Group.find({ groupId: req.params.groupId }).then((doc) => {
    res.status(200).json({ numberOfUsers: doc.length })
  })
});

router.get("/getUserDetails/:email", (req, res, next) => {
  User.find({ email: req.params.email }).then((doc) => {
    res.status(200).json({ users: doc })
  })
});

router.get("/checkEmailExists/:email", (req, res, next) => {
  User.find({ email: req.params.email }).then((doc) => {
    if(doc.length >0)
    res.status(200).json(true)
    else
    res.json(false);
  })
});

router.get("/searchMaxGroupId", (req, res, next) => {
  Group.find().sort({ groupId: -1 }).limit(1).
  then((doc) => {
    res.status(200).json({ group: doc[0].groupId })
  })
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
        return res.json({
       message: 'some error occured!! please try again'
     });
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
                    if(err) return  res.status(500).send({error:err,message:'something went wrong'});
                    return res.send({error : 'none', message : 'successfully updated'});
                  })
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
                    if(err) return  res.status(500).send({error:err,message:'something went wrong'});
                    return res.send({error : 'none', message : 'successfully updated'});
                  })
  });
});

router.post("/sendOtp", (req, res,next) => {
  // console.log("request came",req.body);
  let user = req.body;
  sendMail(user, info => {
    res.send(info);
  });
});

async function sendMail(user,callback) {
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
    subject: "Wellcome to HMS",
    html: `<h1>Hi ${user.name}</h1><br>
    <h4>Your OTP </h4><h1>${user.otp}</h1><br>
    <h4>Thanks for joining us</h4>`
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  callback(info);
}
module.exports = router;
