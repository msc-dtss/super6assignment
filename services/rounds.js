const gameService = require('../services/game');

const fetch = (db, criteria) => {
    // TODO - Order by round
    return db
        .collection('rounds')
        .find(criteria)
        .toArray();
};

const fetchRound = (db, round) => {
    return gameService.fetch(db, { round_id: round });
};

module.exports = {
    fetch,
    fetchRound
};