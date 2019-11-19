const userService = require('../services/users');
const betService = require('../services/bets');
const roundService = require ('../services/rounds')
const gameService = require ('../services/game')

/**
 * Grabs the user profile page. This includes the user information as well as the bets history.
 * @param {*} db The connection to the database
 * @param {*} userId The ID of the user
 * @returns {*} An object with the user information and the bets history
 */
const fetchProfileBundle = async (db, userId) => {
    const users = await userService.fetchById(db, userId); // TODO do we need this becuase of session info?
    const bets = await betService.fetchByUser(db, userId);
    const recentRoundIndex = () => {
        let recentRound = 0
        for (let i = 0; i < bets.length; i++) {
            if (recentRound < bets[i].roundIndex){
                recentRound = bets[i].roundIndex;
            };
        };
    };
    let totalPoints = 0;
    for (i = 0; i < bets.length; i++) {
        totalPoints = totalPoints + bets[i].points;
    };
    const totalBets = bets.length;
    const roundPoints = 0// TODO get roundpoints here;
    const rounds = await roundService.fetch(db, {index: recentRoundIndex})
    const games = await gameService.fetch(db, {roundIndex: recentRound})
    return {
        user: users[0],
        bets: bets[1], // TODO - only return the full bet matching roundIndex?? Can I execute a find here?
        round: rounds,  
        games: games,
        totalPoints: totalPoints,
        totalBets: totalBets,
        roundIndex: recentRound
    }
}

module.exports = {
    fetchProfileBundle
}