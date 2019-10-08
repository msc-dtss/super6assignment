const express = require('express');
const gameService = require('../services/game');

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const games = gameService.fetchFuture(req.app);
  res.render('index', { title: 'Super6 Rugby', games: games});
});

module.exports = router;
