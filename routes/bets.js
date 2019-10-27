const express = require('express');
const betsService = require('../services/bets.js');
const gameService = require('../services/game.js');

const router = express.Router();


router.get('/bets/games', function (req, res, next) {
    gameService.fetchFuture(req.app)
        .then(
            (games) => {
                res.render('bets', { title: 'Super6 Rugby', games: games });
            },
            (reason) => {
                console.log(reason)
            });
});

router.post('/bets', function (req, res, next) {
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
