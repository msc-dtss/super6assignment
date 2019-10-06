const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function(req, res, next) {
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
  let email = request.body.email;
  let password = request.body.password;
  let userId = createUser(request, response, email, password, function (error, result) {
    response.json(result.ops[0]);
  });

});

function getHashedPassword(password){
  let hash = bcrypt.hashSync(password, 10);
  return hash;
}

function createUser(req, res, email, plainTextPassword, postCreate){
  let id = req.app.get('super6db').collection('users').insertOne({ email: email, password: getHashedPassword(plainTextPassword)}, postCreate);
}

module.exports = router;
