const betsService = require('../services/bets');
const roundsService = require('../services/rounds');
const gamesService = require('../services/game');
const dateHelper = require('./helpers/date-helpers');
const errors = require('../errors/super6exceptions');

/**
 * Grabs the user profile page. This includes the user information as well as the bets history.
 * @param {*} db The connection to the database
 * @param {*} user Object containing the user information
 * @param {String} debugDate A debug date as a string (optional)
 * @returns {*} An object with the user information and the bets history
 */
const fetchProfileBundle = async (db, user, debugDate) => {
    const bets = await betsService.fetchByUser(db, user._id);
    const mostRecentRound = betsService.recentRoundIndex(bets);
    const gameBets = await betsService.betsForUserAndRoundGame(db, user._id, mostRecentRound);
    const fullBets = await betsService.fetch(db, {userId: user._id, roundIndex: mostRecentRound});
    const rounds = await roundsService.fetch(db, { index: mostRecentRound });
    const games = await gamesService.fetch(db, { roundIndex: mostRecentRound });

    if(rounds.length === 0) {
        throw new errors.ResourceNotFoundError(`Unable to find any round`);
    }

    const todaysDate = !debugDate ? dateHelper.getToday() : dateHelper.formatDate(new Date(debugDate));

    return {
        user,
        recentBet: fullBets.length > 0 ? fullBets[0] : null,
        gameBets,
        round: rounds[0],
        games,
        totalPoints: betsService.addUpBetPoints(bets),
        totalBets: bets.length,
        roundIndex: mostRecentRound,
        todaysDate
    };
};

module.exports = {
    fetchProfileBundle
}