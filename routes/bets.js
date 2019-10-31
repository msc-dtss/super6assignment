const express = require('express');
const betsService = require('../services/bets.js');
const gameService = require('../services/game.js');
const roundsService = require('../services/rounds');
const ObjectId = require('mongodb').ObjectId;

const router = express.Router();


router.get('/play', function (req, res, next) {
    const db = req.app.get('super6db');
    const isDevelopment = req.app.get('isDevelopment');
    const debugDate = isDevelopment ? req.query.debugDate : null;
    gameService.fetchFuture(db, debugDate).then(
        (games) => {
            res.render('play', {
                title: 'Super6 Rugby - Play',
                games: games,
                loggedIn: true
            }); // TODO: Logged in needs to reflect cookie value and checked against db and games need to be pushed
        },
        (reason) => {
            console.log(reason)
        });
});

router.get('/history', function (req, res, next) {
    const db = req.app.get('super6db');
    roundsService.fetch(db).then((rounds) => {
        gameService.fetchByRound(db, rounds).then((games) => {
            betsService.allForUser(db,new ObjectId('5d9dea063935915c6861feaf')).then((bets) => {
                res.render('history', {
                    title: 'Super6 Rugby - Your History',
                    loggedIn: true,
                    rounds: rounds,
                    games: games,
                    bets: bets
                });
            });//TODO - Use real user id
        });
    }); // TODO: Logged in needs to reflect cookie value and checked against db and games need to be pushed
});

router.post('/', function (req, res, next) {
    const bet = betsService.resolveClientBet(req.body);
    // Attach userId from the session? We should return a 401 error if there is no authenticated session
    bet.userId = req.session.userId;

    const db = req.app.get('super6db');
    betsService.create(db, bet)
        .then(
            (error, result) => {
                res.json(true);
            },
            () => {
                res.statusCode = 500;
                res.send('Error create bet');
            });
});

module.exports = router;
