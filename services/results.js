const getGameResults = async () => {
    return new Promise((resolve, reject) => {
        resolve(
            {
                '5dbb5ba824a8c8398c3a0f8b': {
                    _id: 1,
                    gamesId: '5dbb5ba824a8c8398c3a0f8b',
                    winTeam: 'Japan',
                    teamAScore: 30,
                    teamBScore: 10,
                    teamATries: 4,
                    teamBTries: 1,
                    userPoints: 8
                }
                
            }
        );
    });
}

module.exports = {
    getGameResults
};