const getGameResults = async () => {
    return new Promise((resolve, reject) => {
        resolve([
            {
                _id: 1,
                gamesId: 'match1',
                winTeam: 'Japan',
                teamAScore: 30,
                teamBScore: 10,
                teamATries: 4,
                teamBTries: 1,
                firstTryTime: 4,
                userPoints: 8
            }
        ]);
    });
}

module.exports = {
    getGameResults
};