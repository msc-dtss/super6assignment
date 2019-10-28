const gameService = require('../services/game');

const fetch = (app, criteria) => {
    // TODO - Order by round
    const db = app.get('super6db');
    return db
        .collection('rounds')
        .find(criteria)
        .toArray();
};

const fetchRound = (app, round) => {
    return gameService.fetch(app, {round_id: round});
};

module.exports = {
    fetch,
    fetchRound
};