const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session")
const userService = require("../services/users");
const exceptions = require('../errors/super6exceptions');
const wrap = require('./helpers/exceptionHandler').exceptionWrapper;
const { check, validationResult } = require("express-validator");

const router = express.Router();

router.get('/', wrap(async (req, res, next) => {
    // List all users - NO AUTH AT PRESENT (only for admin)
    const db = req.app.get('super6db');
    userService.list(db).then((users) => {
        res.json(users)
    });
}));

router.post('/signup', [
    check('email').isEmail(),
    check('password').isLength({ min: 7 })
], wrap(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const db = req.app.get('super6db');
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const surname = req.body.surname;
    try {
        await userService.create(db, email, password, firstName, surname);
        req.session.user = await userService.fetchUser(db, email)
        req.session.login = true;
        console.log(req.session.user.email)
        res.redirect("/bets/play");
    } catch (e) {
        if (e instanceof exceptions.ValidationError) {
            console.log(e);
            return res.status(e.httpCode).json(e.details);
        }
    }
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
        if (e instanceof exceptions.InvalidCredentialsError || e instanceof exceptions.UserNotFoundError) {
            req.session.error = e
            console.log(e)
            res.redirect("/");
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
