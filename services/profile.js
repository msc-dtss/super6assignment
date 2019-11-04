const userService = require('../services/users');
const betService = require('../services/bets');

/**
 * Grabs the user profile page. This includes the user information as well as the bets history.
 * @param {*} db The connection to the database
 * @param {*} userId The ID of the user
 * @returns {*} An object with the user information and the bets history
 */
const fetchProfileBundle = async (db, userId) => {
    const users = await userService.fetchById(db, userId);
    const bets = await betService.fetchByUser(db, users[0]);
    return {
        user: users[0],
        bets: bets
    }
}

module.exports = {
    fetchProfileBundle
}