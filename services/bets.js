/**
 * todo
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

module.exports = {
    createBet
}