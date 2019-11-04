const express = require("express");
const bcrypt = require("bcrypt");
const userService = require("../services/users");
const gameService = require("../services/game");
const userProfileService = require('../services/profile') // CS CODE !!!!!!!!

const router = express.Router();

router.get('/', async (req, res, next) => {
    // List all users - NO AUTH AT PRESENT (only for admin)
    const db = req.app.get('super6db');
    userService.list(db).then((users) => {
        res.json(users)
    });
});

router.get('/profile', function (req, res, next) {
    // Should show the user profile page

    // TODO: move the code below to a service (much like service/games.js and such)
    // const db = req.app.get('super6db');
    // const collection = db.collection('users');
    // collection.find({}).toArray(function (err, docs) {
    //     if (err) {
    //         console.error(err);
    //     }
    //     res.json(docs)
    // });
    res.render('profile');
});

router.post('/signup', async (req, res, next) => {
    // Save a user - NO AUTH AT PRESENT
    const db = req.app.get('super6db');
    const email = req.body.email;
    const password = req.body.password;
    // Maybe do a validator like bets.resolveClientBet?
    await userService.create(db, email, password);
    res.send(true);
});

router.post("/login", function(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  const db = req.app.get("super6db");
  const collection = db.collection("users");
  let firstName = "test"; //collection.find({"firstName": email});
  let surname = "user"; //collection.find({"surname": email}); 
/*
  if(email = collection.findOne({emailAddress: email})) {
    bcrypt.compareSync(password, user.password);
}*/
  email === "user@gmail.com" &&
  password === "password"
  {
    req.session.user = email;
    req.session.firstName = firstName;
    req.session.surname = surname;
    req.session.loggedin = true;
    console.log(req.session);
    res.redirect("/users/play");
  } // else {
  //res.redirect("../login");
  //}
});

router.get('/logout', async (req, res, next) => {
    // Delete token from database via user service
  req.session.destroy(() => {
    res.redirect("../");
  });
});


module.exports = router;
