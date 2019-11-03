const ObjectId = require('mongodb').ObjectId;
const errors = require('../errors');

/**
 * Ensures a bet coming in from the client is valid and strips out any invalid attributes
 * @param {*} clientBet The "untrusted" bet coming in from the client
 * @return {*} An object representing a bet in the correct format.
 * @throws {errors.SuperSixValidationError} An input validation error
 */
const resolveClientBet = (clientBet) => {
    if (clientBet.games.length > 6) {
        throw new errors.SuperSixValidationError("Each round only has 6 games");
    }
    if (clientBet.roundId !== 0 && !clientBet.roundId || isNaN(clientBet.roundId)) { //0 is falsy, hence why we need to explicitely check for it
        throw new errors.SuperSixValidationError("Bad round provided");
    }
    if (!clientBet.goldenTry) {
        throw new errors.SuperSixValidationError("Bad goldenTry provided");
    }

    const verifiedBet = {
        roundId: clientBet.roundId,
        gameBets: [],
        goldenTry: clientBet.games[6].goldenTrySelection // Why does this come in games[6]?
    };

    clientBet.games.forEach(game => {
        if (game.id !== 0 && !game.id || isNaN(game.id)) {
            throw new errors.SuperSixValidationError(`Bad id provided for game`);
        }
        if (game.teamATries !== 0 && !game.teamATries || isNaN(game.teamATries)) {
            throw new errors.SuperSixValidationError(`Bad teamATries provided for game ${game.id}`);
        }
        if (game.teamBTries !== 0 && !game.teamBTries || isNaN(game.teamBTries)) {
            throw new errors.SuperSixValidationError(`Bad teamBTries provided for game ${game.id}`);
        }
        if (!game.gameVictor) {
            throw new errors.SuperSixValidationError(`Bad gameVictor provided for game ${game.id}`);
        }
        verifiedBet.gameBets.push({
            id: game.id,
            teamATries: game.teamATries,
            teamBTries: game.teamBTries,
            winTeam: game.gameVictor
        });
    });
    return verifiedBet;
};

/**
 * Creates a bet for a user
 * @param {*} db The connection to the database
 * @param {*} bet The bet that has been previously
 * @return {Promise} A promise with the result?
 */
const create = async (db, bet) => {
    return db.collection("bets").insertOne(bet);
};

/**
 * Deletes a bet owned by a user
 * @param {*} db The connection to the database
 * @param {Number} betID The id of the bet
 * @param {Number} userID The id of the user that owns this bet (to make sure we're not deleting someone else's bet)
 * @return {Promise} A promise with the result?
 */
const deleteBet = async (app, betID, userID) => {
    // do the thing
}

/**
 * Gets the bet made by a user
 * @param {*} db The connection to the database
 * @param {*} criteria An object with the criteria to find bets
 * @return {Promise} A promise with an array of bets
 */
const fetch = async (db, criteria) => {
    return db.collection("bets")
        .find(criteria)
        .toArray();
};

/**
 * Gets the bet made by a user for a round
 * @param {*} db The connection to the database
 * @param {Number} userId The ID of the user
 * @param {Number} roundId The ID of the round
 * @return {Promise} A promise with an array of bets
 */
const madeByUser = async (db, roundId, userId) => {
    return await fetch(db, {
        roundId,
        userId
    });
};

/**
 * Gets all the bets ever made by a user
 * @param {*} db The connection to the database
 * @param {Number} userId The ID of the user
 * @return {Promise} A promise with an array of bets
 */
const allForUser = async (db, userId) => {
    const bets = await fetch(db, { users_id: userId });
    return new Map(bets.map(bet => [bet.games_id, bet])); //Tiago: Not sure if I need to Promisify this? Someone remind me if they see this comment
}

/**
 * Gets a collection of bets made by users for a given round
 * @param {*} db The connection to the database
 * @param {Number} roundId The ID of the round
 * @return {Promise} A promise with an array of bets
 */
const forRound = async (db, roundId) => {
    return await fetch(db, { roundId });
};

/**
 * Gets the winning bets by building the result into the criteria of the query
 * @param {*} db The connection to the database
 * @param {Number} roundId The ID of the round
 * @param {*} results The actual game results. These should be in the same format as `bet.gameBets`
 * @return {Promise} A promise with an array of bets
 */
const findRoundWinners = async (db, roundId, results) => {
    return await fetch(db, {
        roundId,
        gameBets: results.games
    });
};


module.exports = {
    resolveClientBet,
    create,
    delete: deleteBet,
    fetch,
    madeByUser,
    forRound,
    findRoundWinners,
    allForUser,
};
