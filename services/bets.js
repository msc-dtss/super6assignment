/**
 * Creates a bet for a user
 * @param {*} app The express app
 * @param {Number} roundId The ID of the round
 * @return {Promise} A promise with the result?
 */

const create = (app, bet) => {
    const db = app.get("super6db");
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
 * @param {*} app The express app
 * @param {Number} betID The id of the bet
 * @param {Number} userID The id of the user that owns this bet (to make sure we're not deleting someone else's bet)
 */
const delete = (app, betID, userID) => {
    // do the thing
}

module.exports = {
    create
};
