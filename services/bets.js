
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

const DeleteBet = (app, betId) => {

}

module.exports = {
    createBet
}