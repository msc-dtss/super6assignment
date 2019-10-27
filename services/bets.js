/**
 * Creates a bet for a user
 * @param {*} app The express app
 * @param {Number} roundId The ID of the round
 * @return {Promise} A promise with the result?
 */
const createBet = (app, bet) => {
    const db = app.get('super6db');
    const result = db
        .collection('bets')
        .insertOne({
            userId: bet.userId,
            gameId: bet.gameId,
            roundId: bet.roundId,
            teamATries: bet.teamATries,
            teamBTries: bet.teamBTries,
            winTeam: bet.winTeam,
            goldenTry: bet.goldenTry
        });
    // bet should contain `games` as an array of 6 items which will have the bets for each game
    return result;
};

/**
 * Deletes a bet owned by a user
 * @param {*} app The express app
 * @param {Number} betID The id of the bet
 * @param {Number} userID The id of the user that owns this bet (to make sure we're not deleting someone else's bet)
 */
const deleteBet = (app, betID, userID) => {
    // do the thing
}

/**
 * Gets the bet made by a user
 * @param {*} app The express app
 * @param {*} criteria An object with the criteria to find bets
 * @return {Promise} A promise with an array of bets
 */
const fetch = (app, criteria) => {
    const db = app.get("super6db");
    return db.collection("bets")
        .find(criteria)
        .toArray();
};

/**
 * Gets the bet made by a user
 * @param {*} app The express app
 * @param {Number} roundId The ID of the round
 * @return {Promise} A promise with an array of bets
 */
const madeByUser = (app, roundId, userId) => {
    return fetch(app, {
        roundId,
        userId
    });
};

/**
 * Gets a collection of bets made by users for a given round
 * @param {*} app The express app
 * @param {Number} roundId The ID of the round
 * @return {Promise} A promise with an array of bets
 */
const forRound = (app, roundId) => {
    return fetch(app, {
        roundId
    });
};

/**
 * Gets the winning bets by building the result into the criteria of the query
 * @param {*} app The express app
 * @param {Number} roundId The ID of the round
 * @param {*} results The actual game results. These should be in the same format as `bet.gameBets`
 * @return {Promise} A promise with an array of bets
 */
const findRoundWinners = (app, roundId, results) => {
    return fetch({
        roundId,
        gameBets: results.games
    });
};


module.exports = {
    createBet,
    fetch,
    madeByUser,
    forRound,
    findRoundWinners
};