const express = require("express");
const userService = require("../services/users");
const gameService = require("../services/game");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/", function(req, res, next) {
  // List all users - NO AUTH AT PRESENT (only for admin)

  // TODO: move the code below to a service (much like service/games.js and such)
  const db = req.app.get("super6db");
  const collection = db.collection("users");
  collection.find({}).toArray(function(err, docs) {
    if (err) {
      console.error(err);
    }
    res.json(docs);
  });
});

router.get("/profile", function(req, res, next) {
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
  res.render("profile");
});

router.post("/signup", function(req, res, next) {
  // Save a user - NO AUTH AT PRESENT
  const email = req.body.email;
  const password = req.body.password;

  // TODO: move the code below to a service (much like service/games.js and such)
  const db = req.app.get("super6db");
  userService.createUser(
    db,
    email,
    password,
    false,
    function(error, result) {
      res.cookie("super6token", "abcd1234", { maxAge: 3600000 });
      res.redirect("../");
    },
    function() {
      res.statusCode = 500;
      res.send("Error adding user");
    }
  );
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

router.get("/logout", function(req, res, next) {
  // Delete token from database via user service
  req.session.destroy(() => {
    res.redirect("../");
  });
});

router.get("/play", function(req, res, next) {
  const db = req.app.get("super6db");
  gameService.fetchFuture(db).then(
    games => {
      res.render("play", {
        title: "Super6 Rugby - Play",
        games: games,
        testValue: "HELLO WORLD",
        loggedIn: true
      }); // TODO: Logged in needs to reflect cookie value and checked against db and games need to be pushed
    },
    reason => {
      console.log(reason);
    }
  );
});

router.get("/history", function(req, res, next) {
  res.render("history", {
    title: "Super6 Rugby - Your History",
    loggedIn: true
  });
});

module.exports = router;
