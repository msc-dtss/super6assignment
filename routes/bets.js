const express = require('express');
const betsService = require('../services/bets.js');
const gameService = require('../services/game.js');

const router = express.Router();


router.get('/bets/games', function(req, res, next) {
  gameService.fetchFuture(req.app)
  .then((games) => {
    res.render('bets', { title: 'Super6 Rugby', games: games});
  }, 
  (reason) => {
    console.log(reason)
  });
});

router.post('/bets', function (req, res, next) {    

    const bet = { 
        roundId: req.body.roundId, 
        gameId: req.body.gameId, 
        winTeam: req.body.winTeam, 
        teamATries: req.body.teamATries, 
        teamBTries: req.body.teamBTries, 
        userId: req.body.userId, 
        goldenTry: req.body.goldenTry 
    };

    const db = req.app.get('super6db');

    betsService.createBet(db, bet, function (error, result) {
        res.json(true);
    }, function() {
        res.statusCode = 500;
        res.send('Error create bet');
    });

});