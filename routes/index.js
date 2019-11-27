const express = require("express");
const gameService = require("../services/game");
const wrap = require("./helpers/exceptionHandler").exceptionWrapper;

const router = express.Router();

/* GET home page. */
router.get("/", wrap(async (req, res, next) => {
    const db = req.app.get("super6db");
    const games = await gameService.fetchFuture(db, req.query.debugDate);
    res.render("index", {
        title: "Super6 Rugby",
        games: games,
        mainPage: true
    });
}));

/* Load a bunch of static pages. */
['terms', 'contact'].forEach((page)=>{
    router.get(`/${page}`, (req, res, next) => {
        res.render(page, {
            title: `${page.charAt(0).toUpperCase()}${page.slice(1)}`
        });
    });
});


module.exports = router;
