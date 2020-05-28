const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Group = require('../models/group');
const globalData = require('../models/globalData');
const Request = require('../models/groupAddRequest');
const nodemailer = require("nodemailer");


router.get("/getPendingRequests/:email", (req,res,next) => {
  Request.find( {$and :[{ for: req.params.email}, { Status: 'Pending'}]}, { groupId: true}, (err,doc)=>{
    var newArr = doc.map(val => val.groupId)
    res.json({doc: newArr})
  })
})


router.post("/changeRequestStatus", (req,res,next)=>{
  if(req.body.action === "accepted"){
    console.log(req.body)
     User.find({email: req.body.requestFor},(err,doc)=>{
      if(!err){
      doc[0].groups.push(req.body.groupId);
       doc[0].save().then((doc)=>{
       // console.log(doc);
        Request.updateOne({_id: req.body.requestId}, {'$set': { Status: 'Accepted'}},(err, doc) => {
          res.json({message: 'request accepted'});
       //   console.log(doc);
        })
       })
      }
      else
        next(err);
      }).catch(err => {
        res.json({message: 'some error occurred'});
      })

  }
  else{
    Request.updateOne({_id: req.body.requestId}, {'$set': { Status: 'Rejected'}},(err, doc) => {
      res.json({message: 'request rejected successfully'});
      console.log(doc);
    }).catch(err => {
      res.json({message: 'some error occurred'});
    })
  }

})


router.get("/getGroupRequests", (req,res,next)=>{
  var groupArray = req.query.groupList.split(',');
  for(var i=0;i<groupArray.length;i++){
    groupArray[i] = parseInt(groupArray[i]);
  }
 Request.aggregate([
  {
    $match: { groupId : { $in : groupArray}}
   }

 ],(err,doc)=>{
  if(!err){
  var filteredDoc = doc.filter((request) => {
    return request.Status === "Pending";
  })
    res.json({message: 'successful',requests: filteredDoc})
  }
  else
   next(err)
}).catch(err => {
  res.json({message: err, requests: null})
})


})


router.post("/addRequest", (req,res,next) => {
 const requestBody = {
   for: req.body.for,
   groupId: req.body.groupId,
   Status: 'Pending'
 }

  Request.insertMany(requestBody, (err, doc) => {
    if(!err){
      res.json({doc: doc, message: 'request successful'})
    }
    else
     {
       res.json({doc: null, message: 'request failed'})
     }
  })

})


router.get("/getGroupsByName/:name", (req,res,next)=>{
Group.find({groupName: { $regex: new RegExp(req.params.name,"i") }}).then(doc=>{
    res.send({groups: doc})
});
})


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
  var groupArray = req.params.groupId.split(',');
  for(var i=0;i<groupArray.length;i++){
    groupArray[i] = parseInt(groupArray[i]);
  }
  User.aggregate([
      {  $match: { 'groups': { $in : groupArray } }  },
      {  $project : { email: 1, name:1} }
    ],
     (err, doc)=>{
       if(err)
         next(err);
        else
         res.status(200).json({users: doc, message: 'users fetched'});
       }
  ).catch(err => {
    res.status(500).json({users: null, message: 'some error occurred . Error:'+err})
  })
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

router.get("/getGroupMembers", (req,res,next)=>{
  var groupArray = req.query.groupList.split(',');
  for(var i=0;i<groupArray.length;i++){

    groupArray[i] = parseInt(groupArray[i]);

  }
   User.aggregate([
     {
       $match: { 'groups': { $in : groupArray } }
     },
     {
       $unwind : { path:"$groups"}
     },
     {
       $project : { email: 1, groups: 1, name:1}
     }
    ],
     (err, doc)=>{
       if(err)
         next(err);
        else{
        var updatedDoc = doc.filter(function(user)  {
          return groupArray.includes(user.groups);
         });
          res.status(200).json({users: updatedDoc, message: 'users fetched'});
        }
        }
  )


})

router.get("/getGroups/:email", (req,res,next)=>{
  User.findOne({email: req.params.email}).then(doc => {
     Group.find({groupId: { $in : doc.groups }},{ groupId: 1, groupName: 1},(err,doc)=>{
       res.status(200).json({items:doc, message: "groups fetched for a user"});
     })

     }).catch(err => {
       res.status(400).json({items:null, message: "groups fetched for a user"});
     })
})


router.post("/addGroup", (req,res,next)=>{
 console.log(req.body.groupName);
  globalData.find({}, (err,docs)=>{
  const group = new Group({
    groupId: docs[0].latestGroupNumber + 1,
    groupName: req.body.groupName ,
    items:[]
  })

  Group.insertMany(group).then(()=>{
    User.findOne({ email: req.body.userEmail}, (err,doc) => {
      doc.groups.push(group.groupId);
      doc.save().then().catch( err => {
        res.status(500).json({message: 'some error occurred in adding group to the user:' + err});
      })
    })
    updateGroupId(group.groupId);
    res.status(200).json({message: 'group added successfully'})

  }).catch((err)=>{
    console.log(err);
    res.status(400).json({message: 'some error occurred in adding group'})
  });

 });



})

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

function updateGroupId(groupId)
{
  globalData.updateOne({},{
    '$set' : { 'latestGroupNumber' : groupId}
  },
  {useFindAndModify : false},
   function(err,doc){
       if(err) return  res.status(500).send({error:err,message:'something went wrong'});
      }
  )
}
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
