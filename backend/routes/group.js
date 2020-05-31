const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Group = require('../models/group');
const globalData = require('../models/globalData');
const Request = require('../models/groupAddRequest');
const checkAuth = require('../middleware/check-auth');

router.get("/getPendingRequests/:email", checkAuth,(req,res,next) => {
  Request.find( {$and :[{ for: req.params.email}, { Status: 'Pending'}]}, { groupId: true}, (err,doc)=>{
    var newArr = doc.map(val => val.groupId)
    res.json({doc: newArr})
  })
})


router.post("/changeRequestStatus",checkAuth, (req,res,next)=>{
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


router.get("/getGroupRequests", checkAuth,(req,res,next)=>{
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


router.post("/addRequest", checkAuth, (req,res,next) => {
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


router.get("/getGroupsByName/:name", checkAuth, (req,res,next)=>{
Group.find({groupName: { $regex: new RegExp(req.params.name,"i") }}).then(doc=>{
    res.send({groups: doc})
});
})


router.get("/getUsersByGroupId/:groupId", checkAuth,(req, res, next) => {
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

router.get("/searchGroup/:groupId", checkAuth, (req, res, next) => {
  Group.find({ groupId: req.params.groupId }).then((doc) => {
    res.json({ numberOfUsers: doc.length })
  }).catch((err)=>{
    return res.json({message: 'some error occured!! please try again'});
});
});

router.get("/getUserDetails/:email", checkAuth, (req, res, next) => {
  User.find({ email: req.params.email }).then((doc) => {
    res.json({ users: doc })
  }).catch((err)=>{
    return res.json({message: 'some error occured!! please try again'});
});
});

router.get("/checkEmailExists/:email", checkAuth, (req, res, next) => {
  User.find({ email: req.params.email }).then((doc) => {
    if(doc.length >0)
    res.json(true)
    else
    res.json(false);
  }).catch((err)=>{
    return res.json({message: 'some error occured!! please try again'});
});
});

router.get("/getGroupMembers", checkAuth, (req,res,next)=>{
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

router.get("/getGroups/:email", checkAuth, (req,res,next)=>{
  User.findOne({email: req.params.email}).then(doc => {
     Group.find({groupId: { $in : doc.groups }},{ groupId: 1, groupName: 1},(err,doc)=>{
       res.status(200).json({items:doc, message: "groups fetched for a user"});
     })

     }).catch(err => {
       res.status(400).json({items:null, message: "groups fetched for a user"});
     })
})


router.post("/addGroup", checkAuth, (req,res,next)=>{
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

























module.exports = router;
