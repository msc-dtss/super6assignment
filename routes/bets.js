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
        roundId: Number(req.body.roundId), 
        userId: Number(req.body.userId), 
        games: []
    };
    req.body.games.forEach((game) => {
      bet.games.push({
        teamATries: Math.max(Number(game.teamATries), 0),
        teamBTries: game.teamBTries,
        //...
      });
    });

    const db = req.app.get('super6db');

    betsService.createBet(db, bet, function (error, result) {
        res.json(true);
    }, function() {
        res.statusCode = 500;
        res.send('Error create bet');
    });

});
module.exports = router;