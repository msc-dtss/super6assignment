const express = require('express');
const betsService = require('../services/bets.js');
const gameService = require('../services/game.js');
const roundsService = require('../services/rounds.js');
const resultsService = require('../services/results.js');
const errors = require('../errors/super6exceptions');

const wrap = require('./helpers/exceptionHandler').exceptionWrapper;
const router = express.Router();


router.get('/play', wrap(async (req, res, next) => {
    const db = req.app.get('super6db');
    const debugDate = req.app.get('isDevelopment') ? req.query.debugDate : null;
    const games = await gameService.fetchFuture(db, debugDate);

    res.render('play', {
        title: 'Play - Super6 Rugby',
        games: games
    });
}));

router.get('/history', wrap(async (req, res, next) => {
    const db = req.app.get('super6db');
    const gamesByRound = await gameService.fetchIndexedByRoundAndDate(db, {});
    const rounds = await roundsService.fetchIndexedByIndex(db, {});
    const bets = await betsService.betsForUserByGame(db, req.session.user._id);
    const goldenTries = await betsService.goldenTriesForUserByRound(db, req.session.user._id);
    const results = await resultsService.getGameResults();
    const goldenTryResults = await resultsService.getGoldenTryResults();
    const scores = await betsService.scoreForUserByRound(db, req.session.user._id);
    res.render('history', {
        title: 'Your History - Super6 Rugby',
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
        return res.status(e.httpCode || 500).json({ errors: [{message:e.message || 'Error updating bet' }] });
    }
}));

router.put('/:betId', wrap(async (req, res, next) => {
    const db = req.app.get('super6db');
    const betId = req.params.betId;
    try {
        const bet = betsService.resolveClientBet(req.body);
        bet.userId = req.session.user._id;
        await betsService.update(db, betId, bet);
        res.json(true);
    } catch (e) {
        return res.status(e.httpCode || 500).json({ errors: [{message:e.message || 'Error updating bet' }] });
    }
}));

router.get('/play/:betId', wrap(async(req, res, next) => {
    const db = req.app.get('super6db');
    const betId = req.params.betId;
    const betInformation = await betsService.betOfUserAndBetId(db, req.session.user._id, betId);
    betInformation.indexedGames = await betsService.indexBetsByGameId([betInformation]);
    if (!betInformation) {
        throw new errors.UnauthorizedException();
    };

    const games = await gameService.fetchGamesByIds(db, Object.keys(betInformation.indexedGames));
    res.render('play', {
        title: 'Super6 Rugby - Play',
        games,
        betInformation,
        betId
    });

}));

module.exports = router;
