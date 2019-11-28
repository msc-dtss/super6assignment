const express = require("express");
const { check, validationResult } = require("express-validator");
const wrap = require('./helpers/exceptionHandler').exceptionWrapper;
const userService = require("../services/users");
const betsService = require("../services/bets");
const roundsService = require("../services/rounds");
const exceptions = require('../errors/super6exceptions');

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
        console.log(req.session.user.email)
        return res.json({pageToRedirect: '/bets/play'});
    } catch (e) {
        if (e instanceof exceptions.ValidationError) {
            return res.status(e.httpCode).json(e.details);
        }
    }
}));

router.post("/login", wrap(async (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    const debugDate = req.app.get('isDevelopment') ? req.query.debugDate : null;
    const db = req.app.get("super6db");
    try {
        const result = await userService.checkLogin(db, email, password);
        if (result) {
            const user = await userService.fetchUser(db, email);
            const bets = await betsService.fetchByUser(db, user._id);
            const mostRecentRoundIndex = betsService.recentRoundIndex(bets);
            const mostRecentRounds = await roundsService.fetchCurrentRound(db, debugDate);
            const fullBets = await betsService.fetch(db, {userId: user._id, roundIndex: mostRecentRoundIndex});
            const recentBet = fullBets.length > 0 ? fullBets[0] : null;
            req.session.user = user;
            req.session.recentBetId = !recentBet ? null : recentBet._id;
            console.log(req.session.user.email);
            const pageToRedirect = userService.userCanMakeNewBet(recentBet, mostRecentRounds) ? `/profile` : `/bets/play`;
            return res.json({pageToRedirect});
        }
    } catch (e) {
        if (e instanceof exceptions.InvalidCredentialsError || e instanceof exceptions.UserNotFoundError) {
            // In this case we don't want to inform the frontend if the users exists or not.
            // So we want to always pretend it's an exceptions.InvalidCredentialsError
            const err = new exceptions.InvalidCredentialsError();
            return res.status(err.httpCode).json(err.details);
        }
        return res.status(e.httpCode || 500).json(e.details || {errors:[{message: e.message}]});
    }
}));

router.get('/logout', wrap(async (req, res, next) => {
    // Delete token from database via user service
    req.session.destroy(() => {
        res.redirect("/");
    });
}));


module.exports = router;
