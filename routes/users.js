const express = require('express');
const userService = require('../services/users');

const router = express.Router();

router.get('/', function(req, res, next) {
  // List all users - NO AUTH AT PRESENT
  let db = req.app.get('super6db');
  let collection = db.collection('users');
  let items = collection.find({}).toArray(function (err, docs) {
    if (err) {
      console.error(err)
    }
    res.json(docs)
  });
});

router.post('/', function (req, res, next) {
  // Save a user - NO AUTH AT PRESENT
  let email = req.body.email;
  let password = req.body.password;
  let userId = userService.createUser(req.app.get('super6db'), email, password, false, function (error, result) {
    res.json(result.ops[0]);
  }, function() {
    res.statusCode = 500;
    res.send('Error adding user');
  });

});

module.exports = router;
