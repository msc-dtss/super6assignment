const express = require('express');
const gameService = require('../services/game');

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  gameService.fetchFuture(req.app).then((games) => {
    res.render('index', { title: 'Super6 Rugby', games: games });
  }, 
  (reason) => {
    console.log(reason)
  });
});

module.exports = router;
