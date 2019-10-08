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

router.post('/', function (request, response, next) {
  // Save a user - NO AUTH AT PRESENT
  let email = request.body.email;
  let password = request.body.password;
  let userId = userService.createUser(request.app.get('super6db'), email, password, function (error, result) {
    response.json(result.ops[0]);
  });

});

module.exports = router;
