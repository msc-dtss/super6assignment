const express = require('express');
const gameService = require('../services/game');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  gameService.fetchFuture(req.app).then((games) => {
    res.render('index', { title: 'Super6 Rugby', games: games, loggedIn: req.session.loggedIn});
  }, 
  (reason) => {
    console.log(reason)
  });
});

// @Neil/@Mike this isn't needed right?
router.get('/login', function (req, res, next) {
    res.render('login');
});

module.exports = router;
