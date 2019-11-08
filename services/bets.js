const ObjectId = require('mongodb').ObjectId;
const errors = require('../errors/super6exceptions');

/**
 * Ensures a bet coming in from the client is valid and strips out any invalid attributes
 * @param {*} clientBet The "untrusted" bet coming in from the client
 * @return {*} An object representing a bet in the correct format.
 * @throws {errors.ValidationError} An input validation error when there is missing/invalid information
 */
const resolveClientBet = (clientBet) => {
    if (clientBet.games.length > 6) {
        throw new errors.ValidationError("Each round only has 6 games");
    }
    if (clientBet.roundId !== 0 && !clientBet.roundId || isNaN(clientBet.roundId)) { //0 is falsy, hence why we need to explicitely check for it
        throw new errors.ValidationError("Bad round provided");
    }
    if (!clientBet.goldenTry) {
        throw new errors.ValidationError("Bad goldenTry provided");
    }

    const verifiedBet = {
        roundId: clientBet.roundId,
        gameBets: [],
        goldenTry: clientBet.games[6].goldenTrySelection // Why does this come in games[6]?
    };

    clientBet.games.forEach(game => {
        if (game.id !== 0 && !game.id || isNaN(game.id)) {
            throw new errors.ValidationError(`Bad id provided for game`);
        }
        if (game.teamATries !== 0 && !game.teamATries || isNaN(game.teamATries)) {
            throw new errors.ValidationError(`Bad teamATries provided for game ${game.id}`);
        }
        if (game.teamBTries !== 0 && !game.teamBTries || isNaN(game.teamBTries)) {
            throw new errors.ValidationError(`Bad teamBTries provided for game ${game.id}`);
        }
        if (!game.gameVictor) {
            throw new errors.ValidationError(`Bad gameVictor provided for game ${game.id}`);
        }
        verifiedBet.gameBets.push({
            id: game.id,
            teamATries: Number(game.teamATries),
            teamBTries: Number(game.teamBTries),
            winTeam: game.gameVictor
        });
    });
    return verifiedBet;
};

/**
 * Creates a bet for a user
 * @param {*} db The connection to the database
 * @param {*} bet A valid bet
 * @return {boolean} Whether or not we managed to create the bet
 */
const create = async (db, bet) => {
    try {
        await db.collection("bets").insertOne(bet);
        return true;
    } catch (e) {
        // Maybe we need to throw some exceptions here based on what kind of error we get so that we can provide better feedback to the user
        return false
    }
};

/**
 * Deletes a bet owned by a user
 * @param {*} db The connection to the database
 * @param {Number} betID The id of the bet
 * @param {Number} userID The id of the user that owns this bet (to make sure we're not deleting someone else's bet)
 * @return {boolean} Whether or not the bet was deleted
 */
const deleteBet = async (app, betID, userID) => {
    // do the thing
}

/**
 * Fetch bets matching a given criteria
 * @param {*} db The connection to the database
 * @param {*} criteria An object with the criteria to find bets
 * @return {Array} An array of bets
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
 * @return {Array} An array of bets
 */
const madeByUser = async (db, roundId, userId) => {
    return await fetch(db, {
        roundId,
        userId
    });
};

/**
 * Gets all the bets ever made by a user mapped by game
 * @param {*} db The connection to the database
 * @param {Number} userId The ID of the user
 * @return {Map} A map with the bets indexed by gameId
 */
const allForUser = async (db, userId) => { //maybe needs a clearer name
    const bets = await fetch(db, { users_id: userId });
    return new Map(bets.map(bet => [bet.games_id, bet])); //Does this need to be a map or can it be regular JSON?
}

/**
 * Gets a collection of bets made by users for a given round
 * @param {*} db The connection to the database
 * @param {Number} roundId The ID of the round
 * @return {Array} An array of bets
 */
const forRound = async (db, roundId) => {
    return await fetch(db, { roundId });
};

/**
 * Gets the winning bets by building the result into the criteria of the query
 * @param {*} db The connection to the database
 * @param {Number} roundId The ID of the round
 * @param {*} results The actual game results. These should be in the same format as `bet.gameBets`
 * @return {Array} An array of bets
 */
const findRoundWinners = async (db, roundId, results) => {
    return await fetch(db, {
        roundId,
        gameBets: results.games
    });
};


const scoreBets = async (db, bets, results) => {

}

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
