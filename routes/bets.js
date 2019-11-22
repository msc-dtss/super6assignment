const express = require('express');
const betsService = require('../services/bets.js');
const gameService = require('../services/game.js');
const roundsService = require('../services/rounds.js');
const resultsService = require('../services/results.js');

const wrap = require('./helpers/exceptionHandler').exceptionWrapper;
const router = express.Router();


router.get('/play', wrap(async (req, res, next) => {
    const db = req.app.get('super6db');
    const debugDate = req.app.get('isDevelopment') ? req.query.debugDate : null;
    const games = await gameService.fetchFuture(db, debugDate);
    console.table(games)
    res.render('play', {
        title: 'Super6 Rugby - Play',
        games: games
    });
}));

router.get('/history', wrap(async (req, res, next) => {
    const db = req.app.get('super6db');
    const gamesByRound = await gameService.fetchIndexedByRoundAndDate(db, {});
    const rounds = await roundsService.fetchRoundsByIndex(db, {});
    const bets = await betsService.betsForUserByGame(db, req.session.user._id);
    const goldenTries = await betsService.goldenTriesForUserByRound(db, req.session.user._id);
    const results = await resultsService.getGameResults();
    const goldenTryResults = await resultsService.getGoldenTryResults();
    const scores = await betsService.scoreForUserByRound(db, req.session.user._id);
    res.render('history', {
        title: 'Super6 Rugby - Your History',
        loggedIn: !!req.session.user,
        user: req.session.user || null,
        rounds: rounds,
        games: gamesByRound,
        bets: bets,
        goldenTries: goldenTries,
        results: results,
        goldenTryResults: goldenTryResults,
        scores: scores
    });
}));

router.post('/', wrap(async (req, res, next) => {

    const db = req.app.get('super6db');
    try {
        const bet = betsService.resolveClientBet(req.body);
        bet.userId = req.session.user._id;
        await betsService.create(db, bet);
        res.json(true);
    } catch (e) {
        // TODO: Need to verify why we couldn't create the bet.
        // Basically need to check if the error came from the client side (4**) or if it's an actual server error (5**)
        res.statusCode = e.httpCode || 500;
        res.send(e.message || 'Error creating bet');
    }
}));

module.exports = router;
