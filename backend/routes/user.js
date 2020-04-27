const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Group = require('../models/group');


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
  User.find().sort({ groupId: -1 }).limit(1).then((doc) => {
    res.status(200).json({ users: doc })
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

    const group = new Group({
      groupId: req.body.groupId
    })


    user.save().then((result) => {
      console.log('it added user');
      group.save().then(() => {
        res.status(201).json({
          message: 'user added successfully',
          result: result
        });
        console.log('it came here');
      }).catch((err) => {
        res.json({
          message: 'some error occurred in adding group ' + err,
          result: err
        });
      })

    }).catch((err)=>{
      res.json({
        message: 'some error occurred in adding user ' + err,
        result: err
      });
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
           user : fetchedUser.email.split('.')[0],
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
  const profile = new User({
    name : req.body.name,
    email :  req.body.email,
    password : req.body.password,
    groupId : req.body.groupId,
    profilePicId : req.body.profilePicId
  });
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
// router.put("/updateProfile/:email/",checkAuth,(req,res,next)=>{
//   const profile = new Expense({
//     purpose : req.body.purpose,
//     amount :  req.body.amount,
//     dateOfPurchase : req.body.dateOfPurchase,
//     description : req.body.description,
//     forWhom : req.body.forWhom
//   });
//   User.updateOne({$and : [{email : req.params.email},{'expenses._id' : req.params._id}]},
//                   {'$set' : {'expenses.$' : expense}},
//                   {useFindAndModify : false},
//                   function(err,doc){
//                     if(err) return  res.status(500).send({error:err,message:'something went wrong'});
//                     return res.send({error : 'none', message : 'successfully updated'});
//                   })
// });

module.exports = router;
