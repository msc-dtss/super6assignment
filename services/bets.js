const createBet = (app, bet) => {
    const db = app.get("super6db");
    const result = db.collection("bets").insertOne({
        userId: bet.userId,
        gameId: bet.gameId,
        roundId: bet.roundId,
        gameBets: [
            {
                teamATries: bet.games[0].teamATries,
                teamBTries: bet.games[0].teamBTries,
                winTeam: bet.games[0].gameVictor
            },
            {
                teamATries: bet.games[1].teamATries,
                teamBTries: bet.games[1].teamBTries,
                winTeam: bet.games[1].gameVictor
            },
            {
                teamATries: bet.games[2].teamATries,
                teamBTries: bet.games[2].teamBTries,
                winTeam: bet.games[2].gameVictor
            },
            {
                teamATries: bet.games[3].teamATries,
                teamBTries: bet.games[3].teamBTries,
                winTeam: bet.games[3].gameVictor
            },
            {
                teamATries: bet.games[4].teamATries,
                teamBTries: bet.games[4].teamBTries,
                winTeam: bet.games[4].gameVictor
            },
            {
                teamATries: bet.games[5].teamATries,
                teamBTries: bet.games[5].teamBTries,
                winTeam: bet.games[5].gameVictor
            }
        ],
        goldenTry: bet.games[6].goldenTrySelection
    });
    // bet should contain `games` as an array of 6 items which will have the bets for each game
    return result;
};

const DeleteBet = (app, betId) => { };

module.exports = {
    createBet
};
