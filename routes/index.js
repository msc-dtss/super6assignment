const express = require("express");
const gameService = require("../services/game");
const wrap = require("./helpers/exceptionHandler").exceptionWrapper;

const router = express.Router();

/* GET home page. */
router.get(
  "/",
  wrap(async (req, res, next) => {
    const db = req.app.get("super6db");
    const games = await gameService.fetchFuture(db, req.query.debugDate);
    const token = req.session.cookie.super6token || null;
    // Check the token validity with the user service

    res.render("index", {
      title: "Super6 Rugby",
      games: games,
      mainPage: true
    });
  })
);

// @Neil/@Mike this isn't needed right?
router.get(
  "/login",
  wrap(async (req, res, next) => {
    res.render("login");
  })
);

module.exports = router;
