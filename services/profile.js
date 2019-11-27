const userService = require('../services/users');
const betService = require('../services/bets');
const roundService = require('../services/rounds');
const gameService = require('../services/game');
const dateHelper = require('./helpers/date-helpers');


/**
 * Get the most recent round Index of bets placed
 * @param {Array} bets A collection of bets
 * @returns {Number} The index of the most recent round in the collection of bets
 */
const recentRoundIndex = (bets) => {
    let recentRound = 0
    for (let i = 0; i < bets.length; i++) {
        if (recentRound < bets[i].roundIndex) {
            recentRound = bets[i].roundIndex;
        };
    };
    return recentRound;
};

/**
 * Grabs the user profile page. This includes the user information as well as the bets history.
 * @param {*} db The connection to the database
 * @param {String} userId The ID of the user
 * @returns {*} An object with the user information and the bets history
 */
const fetchProfileBundle = async (db, userId) => {
    const users = await userService.fetchById(db, userId); // TODO do we need this because of session info?
    const bets = await betService.fetchByUser(db, userId);
    const mostRecentRound = recentRoundIndex(bets);
    const recentBet = await betService.betsForUserAndRoundGame(db, userId, mostRecentRound);
    const fullBets = await betService.fetch(db, {userId: userId, roundIndex: mostRecentRound});
    const rounds = await roundService.fetch(db, { index: mostRecentRound });
    const games = await gameService.fetch(db, { roundIndex: mostRecentRound });

    return {
        user: users[0],
        bets: fullBets,
        gameBets: recentBet, //Same thing with plural/singular
        round: rounds, //Same thing with plural/singular
        games,
        totalPoints: addUpBetPoints(bets),
        totalBets: bets.length,
        roundIndex: mostRecentRound,
        todaysDate: dateHelper.getToday()
    };
};

module.exports = {
    fetchProfileBundle
}