const resolveClientBet = (clientBet) => {
    if (clientBet.games.length > 6) {
        throw new Error("Each round only has 6 games!") // Todo: Create a new Error type.
    }
    if (clientBet.roundId !== 0 && !clientBet.roundId) { //0 is falsy, hence why we need to explicitely check for it
        throw new Error("No round provided!") // Todo: Create a new Error type.
    }
    if (!clientBet.goldenTry) {
        throw new Error("No golden try provided!") // Todo: Create a new Error type.
    }

    const verifiedBet = {
        roundId: clientBet.roundId,
        gameBets: [],
        goldenTry: clientBet.games[6].goldenTrySelection // Why does this come in games[6]?
    };

    clientBet.games.forEach(game => {
        if (game.id !== 0 && !game.id) {
            throw new Error(`No id provided for game`) // Todo: Create a new Error type.
        }
        if (game.teamATries !== 0 && !game.teamATries) {
            throw new Error(`No teamATries provided for game ${game.id}`) // Todo: Create a new Error type.
        }
        if (game.teamBTries !== 0 && !game.teamBTries) {
            throw new Error(`No teamBTries provided for game ${game.id}`) // Todo: Create a new Error type.
        }
        if (game.gameVictor !== 0 && !game.gameVictor) {
            throw new Error(`No gameVictor provided for game ${game.id}`) // Todo: Create a new Error type.
        }
        verifiedBet.gameBets.push({
            id: game.id,
            teamATries: game.teamATries,
            teamBTries: game.teamBTries,
            winTeam: game.gameVictor
        });
    });
    return verifiedBet;
}

/**
 * Creates a bet for a user
 * @param {*} db The connection to the database
 * @param {Number} roundId The ID of the round
 * @return {Promise} A promise with the result?
 */
const create = (db, bet) => {
    const betToInsert = {
        userId: bet.userId,
        roundId: bet.roundId,
        gameBets: [],
        goldenTry: bet.games[6].goldenTrySelection // Why does this come in games[6]?
    };

    if (bet.games.length > 6) {
        throw new Error("Each round only has 6 games!") // Todo: Create a new Error type.
    }

    bet.games.forEach(game => {
        betToInsert.gameBets.push({
            teamATries: game.teamATries,
            teamBTries: game.teamBTries,
            winTeam: game.gameVictor
        });
    });
    return db.collection("bets").insertOne(betToInsert);
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

module.exports = {
    resolveClientBet,
    create,
    delete: deleteBet,
};
