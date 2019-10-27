/**
 * Creates a bet for a user
 * @param {*} db The connection to the database
 * @param {Number} roundId The ID of the round
 * @return {Promise} A promise with the result?
 */
const createBet = (db, bet) => {
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
 * @param {*} db The connection to the database
 * @param {Number} betID The id of the bet
 * @param {Number} userID The id of the user that owns this bet (to make sure we're not deleting someone else's bet)
 */
const deleteBet = (db, betID, userID) => {
    // do the thing
}

/**
 * Gets the bet made by a user
 * @param {*} db The connection to the database
 * @param {*} criteria An object with the criteria to find bets
 * @return {Promise} A promise with an array of bets
 */
const fetch = (db, criteria) => {
    return db.collection("bets")
        .find(criteria)
        .toArray();
};

/**
 * Gets the bet made by a user
 * @param {*} db The connection to the database
 * @param {Number} roundId The ID of the round
 * @return {Promise} A promise with an array of bets
 */
const madeByUser = (db, roundId, userId) => {
    return fetch(db, {
        roundId,
        userId
    });
};

/**
 * Gets a collection of bets made by users for a given round
 * @param {*} db The connection to the database
 * @param {Number} roundId The ID of the round
 * @return {Promise} A promise with an array of bets
 */
const forRound = (db, roundId) => {
    return fetch(db, {
        roundId
    });
};

/**
 * Gets the winning bets by building the result into the criteria of the query
 * @param {*} db The connection to the database
 * @param {Number} roundId The ID of the round
 * @param {*} results The actual game results. These should be in the same format as `bet.gameBets`
 * @return {Promise} A promise with an array of bets
 */
const findRoundWinners = (db, roundId, results) => {
    return fetch(db, {
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