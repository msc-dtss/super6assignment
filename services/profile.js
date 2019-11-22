const userService = require('../services/users');
const betService = require('../services/bets');
const roundService = require ('../services/rounds')
const gameService = require ('../services/game')

/**
 * Grabs the user profile page. This includes the user information as well as the bets history.
 * @param {*} db The connection to the database
 * @param {String} userId The ID of the user
 * @returns {*} An object with the user information and the bets history
 */
const fetchProfileBundle = async (db, userId) => {
    const users = await userService.fetchById(db, userId); // TODO do we need this becuase of session info?
    const bets = await betService.fetchByUser(db, userId);
    
    // Get the most recent round Index of bets placed
    const recentRoundIndex = () => {
        var recentRound = 0
        for (let i = 0; i < bets.length; i++) {
            if (recentRound < bets[i].roundIndex){
                recentRound = bets[i].roundIndex;
            };
        };
        return recentRound;
    };
    const mostRecentRound = recentRoundIndex();
    
    const recentBet = await betService.fetch(db, {userId: userId, roundIndex: mostRecentRound});

    // Gets the total points from all placed bets
    let totalPoints = 0;
    for (i = 0; i < bets.length; i++) {
        totalPoints = totalPoints + bets[i].points; //TODO Bet in Db has no points key.
    };

    // Gets the number of times the user has bet on rounds previously
    const totalBets = bets.length;

    const rounds = await roundService.fetch(db, {index: mostRecentRound});
    const games = await gameService.fetch(db, {roundIndex: mostRecentRound});

    // Grabs todays date & formats to "yyyy/mm/dd"
    const todaysDateGetter = () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = yyyy + '/' + mm + '/' + dd;
        return today;
    };
    const todaysDate = todaysDateGetter();

    return {
        user: users[0],
        bets: recentBet,
        round: rounds,  
        games: games,
        totalPoints: totalPoints,
        totalBets: totalBets,
        roundIndex: mostRecentRound,
        todaysDate: todaysDate
    };
};

module.exports = {
    fetchProfileBundle
}