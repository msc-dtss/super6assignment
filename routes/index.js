const express = require('express');
const gameService = require('../services/game');
const cookieParser = require('cookie-parser');

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    const db = req.app.get('super6db');
    gameService.fetchFuture(db, req.query.debugDate).then(
        (games) => {
            const token = req.cookies.super6token;
            // Check the token validity with the user service

            res.render('index', {
                title: 'Super6 Rugby',
                games: games,
                loggedIn: token != null
            });
        },
        (reason) => {
            console.log(reason)
        });
});

// @Neil/@Mike this isn't needed right?
router.get('/login', function (req, res, next) {
    res.render('login');
});

module.exports = router;