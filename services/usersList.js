
/* const userService = require('../services/users');
var express = require('express')
var app = express() */

var usersList = function (req, res, next)
  {
        const db = req.app.get('super6db');
         const collection = db.collection('users');

        collection.find({}).toArray(
            function (err, docs)
    {
    
        if (err) {
            console.error(err);
    }
        res.json(docs)
      
        
    });
    
    usersList.save((error, docs) =>
    {
        if (err) {
            res.send (err)
        }
    
        res.json(docs)
        
    });


};


 module.exports = {usersList}
 
