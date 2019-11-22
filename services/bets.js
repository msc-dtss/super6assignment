const pointsConfig = require('../config/points.json');
const errors = require('../errors/super6exceptions');
const dbHelper = require('../services/helpers/db-helper.js');

/**
 * Ensures a bet coming in from the client is valid and strips out any invalid attributes
 * @param {*} clientBet The "untrusted" bet coming in from the client
 * @return {*} An object representing a bet in the correct format.
 * @throws {errors.ValidationError} An input validation error when there is missing/invalid information
 */
const resolveClientBet = (clientBet) => {
    if(!clientBet){
        throw new errors.ValidationError("No bet!");
    }
    if (!clientBet.games || !Array.isArray(clientBet.games)) {
        throw new errors.ValidationError("Games need to be listed as an array");
    }
    if (clientBet.games.length !== 6) {
        throw new errors.ValidationError("Each round must have 6 games");
    }
    if (clientBet.roundIndex !== 0 && !clientBet.roundIndex || isNaN(clientBet.roundIndex || Number(clientBet.roundIndex) < 0)) { //0 is falsy, hence why we need to explicitely check for it
        throw new errors.ValidationError("Bad round provided");
    }
    if (clientBet.goldenTrySelection !== 0 && !clientBet.goldenTrySelection || isNaN(clientBet.goldenTrySelection) || Number(clientBet.goldenTrySelection) < 0) {
        throw new errors.ValidationError("Bad goldenTry provided");
    }

    const verifiedBet = {
        roundIndex: Number(clientBet.roundIndex),
        gameBets: [],
        goldenTry: Number(clientBet.goldenTrySelection)
    };

    clientBet.games.forEach(game => {
        if (game.id !== 0 && !game.id) {
            throw new errors.ValidationError(`Bad id provided for game (${game.id})`);
        }
        if (game.teamATries !== 0 && !game.teamATries || isNaN(game.teamATries) || Number(game.teamATries) < 0) {
            throw new errors.ValidationError(`Bad teamATries provided for game ${game.id}`);
        }
        if (game.teamBTries !== 0 && !game.teamBTries || isNaN(game.teamBTries) || Number(game.teamBTries) < 0) {
            throw new errors.ValidationError(`Bad teamBTries provided for game ${game.id}`);
        }
        if (!game.gameVictor || typeof game.gameVictor !== "string") {
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
        bet._id = dbHelper.newId();
        await db.collection("bets").insertOne(bet);
        return true;
    } catch (e) {
        // Maybe we need to throw some exceptions here based on what kind of error we get so that we can provide better feedback to the user
        return false
    }
};

/**
 * Updates a bet given a bet ID
 * @param {*} db The connection to the database
 * @param {string} betId The id of the bet
 * @param {*} updateObject The object containing the updates to the fields
 * @param {boolean} replace Whether or not to replace the document completely
 */
const update = async (db, betId, updateObject, replace) => {
    const replaceAllContent = replace || false;
    const updates = replaceAllContent ? updateObject : { $set: updateObject }
    db.collection('bets').updateOne({ _id: betId }, updates);
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
 * @param {string} userId The ID of the user
 * @param {Number} roundIndex The index of the round
 * @return {Array} An array of bets
 */
const madeByUser = async (db, roundIndex, userId) => {
    return await fetch(db, {
        roundIndex,
        userId
    });
};

/**
 * Gets all the bets for a user, keyed by game id
 * @param {*} db The connection to the database
 * @param {string} userId The ID of the user
 */
const betsForUserByGame = async (db, userId) => {
    const bets = {}
    const dbBets = await fetch(db, { userId: userId });
    dbBets.forEach(dbBet => {
        dbBet.gameBets.forEach(gameBet => {
            bets[gameBet.id] = gameBet;
        })
    })
    return bets;
}

/**
 * Gets all the golden try predictions for a user, keyed by user id
 * @param {*} db The connection to the database
 * @param {string} userId The ID of the user
 */
const goldenTriesForUserByRound = async (db, userId) => {
    const goldenTries = {};
    const dbBets = await fetch(db, { userId: userId });
    dbBets.forEach(dbBet => {
        goldenTries[dbBet.roundIndex] = dbBet.goldenTry;
    });
    return goldenTries;
}

/**
 * Gets a collection of bets made by users for a given round
 * @param {*} db The connection to the database
 * @param {Number} roundIndex The index of the round
 * @return {Array} An array of bets
 */
const forRound = async (db, roundIndex) => {
    return await fetch(db, { roundIndex });
};

/**
 * Gets the winning bets by building the result into the criteria of the query
 * @param {*} db The connection to the database
 * @param {Number} roundIndex The index of the round
 * @param {*} results The actual game results. These should be in the same format as `bet.gameBets`
 * @return {Array} An array of bets
 */
const findRoundWinners = async (db, roundIndex, results) => {
    return await fetch(db, {
        roundIndex,
        gameBets: results.games
    });
};

/**
 * Updates all provided bets with their total points based on the results (if a matching one is found).
 * This method should run when we get a new result and on application startup.
 * @param {*} db The connection to the database
 * @param {*} unscoredBets A list of bets that have not yet been scored
 * @param {*} results All results
 */
const score = async (db, unscoredBets, results) => {
    unscoredBets.forEach(async (bet) => {
        const matchingResult = results.find((result) => {
            return result.roundIndex === bet.roundIndex
        });
        let totalPoints = 0;
        if (matchingResult) {
            matchingResult.games.forEach(async (game) => {
                const betGame = bet.gameBets.find(g => g.id === game.gameId);
                if(!!betGame){
                    const resultPoints = game.winTeam === betGame.winTeam ? pointsConfig.result : 0;
                    const triesPoints = game.teamATries === betGame.teamATries && game.teamBTries === betGame.teamBTries ? pointsConfig.tries : 0;
                    totalPoints += resultPoints + triesPoints;
                }
            });
        }
        await update(db, bet._id, {
            points: totalPoints
        });
    });
};

/**
 * Gets the score for a user for each round
 * @param {*} db The connection to the database
 * @param {string} userId The id of the user
 * @returns {*} An object with the points of a user by roundIndex
 */
const scoreForUserByRound = async (db, userId) => {
    let byRound = {};
    const dbBets = await fetch(db, { userId: userId });
    dbBets.forEach(dbBet => {
        byRound[dbBet.roundIndex] = dbBet.points;
    });
    return byRound;
};

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
    goldenTriesForUserByRound,
    scoreForUserByRound
};
