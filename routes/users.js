const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session")
const userService = require("../services/users");
const errors = require('../errors/super6exceptions');
const wrap = require('./helpers/exceptionHandler').exceptionWrapper;

const router = express.Router();

router.get('/', wrap(async (req, res, next) => {
    // List all users - NO AUTH AT PRESENT (only for admin)
    const db = req.app.get('super6db');
    userService.list(db).then((users) => {
        res.json(users)
    });
}));

router.post('/signup', wrap(async (req, res, next) => {
    // Save a user - NO AUTH AT PRESENT
    const db = req.app.get('super6db');
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const surname = req.body.surname;
    //TODO: Maybe do a validator like bets.resolveClientBet?
    await userService.create(db, email, password, firstName, surname);

    // TODO - Do we want to also login the user automatically? Yes ;-)
    res.send(true); // redirect somewhere?
}));

router.post("/login", wrap(async (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    const db = req.app.get("super6db");
    try {
        const result = await userService.checkLogin(db, email, password);
        if (result) {
            req.session.user = await userService.fetchUser(db, email)
            req.session.login = true;
            console.log(req.session.user.email)
            res.redirect("/bets/play");
        }
    } catch (e) {
        if (e instanceof errors.InvalidCredentialsError) {
            res.redirect("/"); //TODO: Provide feedback to user that login was unsuccessful
        }
    }
}));

router.get('/logout', wrap(async (req, res, next) => {
    // Delete token from database via user service
    req.session.destroy(() => {
        res.redirect("/");
    });
}));


module.exports = router;
