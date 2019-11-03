const express = require('express');
const betsService = require('../services/bets.js');
const gameService = require('../services/game.js');
const roundsService = require('../services/rounds');
const ObjectId = require('mongodb').ObjectId;

const router = express.Router();


router.get('/play', async (req, res, next) => {
    // TODO: Logged in needs to reflect cookie value and checked against db and games need to be pushed
    const db = req.app.get('super6db');
    const debugDate = req.app.get('isDevelopment') ? req.query.debugDate : null;
    const games = await gameService.fetchFuture(db, debugDate);
    res.render('play', {
        title: 'Super6 Rugby - Play',
        games: games,
        loggedIn: true
    });
});

router.get('/history', async (req, res, next) => {
    // TODO: Logged in needs to reflect cookie value and checked against db and games need to be pushed
    const db = req.app.get('super6db');
    const rounds = await roundsService.fetch(db);
    const games = await gameService.fetchByRound(db, rounds);
    const bets = await betsService.allForUser(db, new ObjectId('5d9dea063935915c6861feaf')); //TODO - Use real user id
    res.render('history', {
        title: 'Super6 Rugby - Your History',
        loggedIn: true,
        rounds: rounds,
        games: games,
        bets: bets
    });
});

router.post('/', async (req, res, next) => {
    const bet = betsService.resolveClientBet(req.body);
    // Attach userId from the session? We should return a 401 error if there is no authenticated session
    bet.userId = req.session.userId;

    const db = req.app.get('super6db');
    try {
        await betsService.create(db, bet);
        res.json(true);
    } catch (e) {
        // TODO: Need to verify why we couldn't create the bet.
        // Basically need to check if the error came from the client side (4**) or if it's an actual server error (5**)
        res.statusCode = 500; // (or 400ish if error is caused by the input coming from the client)
        res.send('Error create bet');
    }
});

module.exports = router;
