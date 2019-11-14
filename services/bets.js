const ObjectId = require('mongodb').ObjectId;
const pointsConfig = require('../config/points.json');
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
 * @param {Number} betId The id of the bet
 * @param {Number} userId The id of the user that owns this bet (to make sure we're not deleting someone else's bet)
 * @return {boolean} Whether or not the bet was deleted
 */
const deleteBet = async (db, betId, userId) => {
    // do the thing
}

/**
 * Updates a bet given a bet ID
 * @param {*} db The connection to the database
 * @param {*} betId The id of the bet
 * @param {*} updateObject The object containing the updates to the fields
 * @param {boolean} replace Whether or not to replace the document completely
 */
const update = async (db, betId, updateObject, replace) => {
    const replaceAllContent = replace || false;
    const updates = replaceAllContent ? updateObject : { $set: updateObject }
    db.collection('bets').update({ _id: betId }, updates);
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
 * Fetches any bet that does not have a `points` field.
 * @param {*} db The connection to the database
 */
const fetchUnscoredBets = async (db) => {
    return fetch(db, {
        points: { $exists: false }
    });
}

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
 * Gets all the bets for a user, keyed by game id
 * @param {*} db The connection to the database
 * @param {*} userId The ID of the user
 */
const betsForUserByGame = async(db, userId) => {
    const bets = {}
    const dbBets = await fetch(db, { userId: new ObjectId(userId) });
    dbBets.forEach(dbBet => {
        dbBet.gameBets.forEach(gameBet => {
            bets[gameBet.id] = gameBet;
        })
    })
    return bets;
}

/**
 * Gets all the golden try predictions for a user, keyed by user id
 * @param {*} db 
 * @param {*} userId 
 */
const goldenTriesForUserByRound = async(db, userId) => {
    const goldenTries = {};
    const dbBets = await fetch(db, { userId: new ObjectId(userId) });
    dbBets.forEach(dbBet => {
        goldenTries[dbBet.roundId] = dbBet.goldenTry;
    });
    return goldenTries;
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

/**
 * Updates all provided bets with their total points based on the results (if a matching one is found).
 * This method should run when we get a new result.
 * @param {*} db The connection to the database
 * @param {*} unscoredBets A list of bets that have not yet been scored
 * @param {*} results All results
 */
const score = async (db, unscoredBets, results) => {
    // TODO - I think this needs updating to support gameBets being a child of a bet (ie match bets are nested within 1 bet object)
    unscoredBets.forEach(async (bet) => {
        const matchingResult = results.find((result) => {
            return result.gameId === bet.gameId
        });
        if (matchingResult) {
            const resultPoints = matchingResult.winTeam === bet.winTeam ? pointsConfig.result : 0;
            const triesPoints = matchingResult.teamATries === bet.teamATries && matchingResult.teamBTries === bet.teamBTries ? pointsConfig.tries : 0;
            await update(db, bet._id, {
                points: resultPoints + triesPoints
            });
        }
    });
}

module.exports = {
    resolveClientBet,
    create,
    fetch,
    madeByUser,
    forRound,
    findRoundWinners,
    update,
    score,
    delete: deleteBet,
    fetchUnscoredBets,
    betsForUserByGame,
    goldenTriesForUserByRound
};
