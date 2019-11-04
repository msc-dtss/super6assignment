const express = require('express');
const gameService = require('../services/game');
const cookieParser = require('cookie-parser');

const router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
    const db = req.app.get('super6db');
    const games = await gameService.fetchFuture(db, req.query.debugDate);
    const token = req.cookies.super6token;
    // Check the token validity with the user service

    res.render('index', {
        title: 'Super6 Rugby',
        games: games,
        loggedIn: token != null
    });
});

// @Neil/@Mike this isn't needed right?
router.get('/login', async (req, res, next) => {
    res.render('login');
});

module.exports = router;