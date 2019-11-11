const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session")
const userService = require("../services/users");
const errors = require('../errors/super6exceptions');

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
    const firstName = req.body.firstName;
    const surname = req.body.surname;
    //TODO: Maybe do a validator like bets.resolveClientBet?
    await userService.create(db, email, password, firstName, surname);

    // Do we want to also login the user automatically?
    res.send(true); // redirect somewhere?
});

router.post("/login", async (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    const db = req.app.get("super6db");
    try {
        await userService.checkLogin(db, email, password);{
        req.session.user = await userService.fetchUser(db, email)
        req.session.login = true;
        console.log(req.session.user.email)
        //console.log(req.session.login)
        res.redirect("/bets/play");
        }
    } catch (e) {
        if (e instanceof errors.InvalidCredentialsError) {
            res.redirect("/"); //TODO: Provide feedback to user that login was unsuccessful
        }
    }
});

router.get('/logout', async (req, res, next) => {
    // Delete token from database via user service
    req.session.destroy(() => {
        res.redirect("/");
    });
});


module.exports = router;
