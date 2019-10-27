/**
 * Ensures a bet coming in from the client is valid and strips out any invalid attributes
 * @param {*} clientBet The "untrusted" bet coming in from the client
 * @return {*} An object representing a bet in the correct format.
 */
const resolveClientBet = (clientBet) => {
    if (clientBet.games.length > 6) {
        throw new Error("Each round only has 6 games") // Todo: Create a new Error type.
    }
    if (clientBet.roundId !== 0 && !clientBet.roundId || isNaN(clientBet.roundId)) { //0 is falsy, hence why we need to explicitely check for it
        throw new Error("Bad round provided") // Todo: Create a new Error type.
    }
    if (!clientBet.goldenTry) {
        throw new Error("Bad goldenTry provided") // Todo: Create a new Error type.
    }

    const verifiedBet = {
        roundId: clientBet.roundId,
        gameBets: [],
        goldenTry: clientBet.games[6].goldenTrySelection // Why does this come in games[6]?
    };

    clientBet.games.forEach(game => {
        if (game.id !== 0 && !game.id || isNaN(game.id)) {
            throw new Error(`Bad id provided for game`) // Todo: Create a new Error type.
        }
        if (game.teamATries !== 0 && !game.teamATries || isNaN(game.teamATries)) {
            throw new Error(`Bad teamATries provided for game ${game.id}`) // Todo: Create a new Error type.
        }
        if (game.teamBTries !== 0 && !game.teamBTries || isNaN(game.teamBTries)) {
            throw new Error(`Bad teamBTries provided for game ${game.id}`) // Todo: Create a new Error type.
        }
        if (!game.gameVictor) {
            throw new Error(`Bad gameVictor provided for game ${game.id}`) // Todo: Create a new Error type.
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
const create = (db, bet) => {
    return db.collection("bets").insertOne(bet);
};

/**
 * Deletes a bet owned by a user
 * @param {*} db The connection to the database
 * @param {Number} betID The id of the bet
 * @param {Number} userID The id of the user that owns this bet (to make sure we're not deleting someone else's bet)
 */
const deleteBet = (app, betID, userID) => {
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
    resolveClientBet
    create,
    delete: deleteBet,
    fetch,
    madeByUser,
    forRound,
    findRoundWinners,
};
