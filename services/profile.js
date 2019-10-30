const userService = require('../services/users');
const betService = require('../services/bets');
/**
 * Grabs the user profile page data
 * @param {*} db The connection to the database
 */

const fetchProfileBundle = (db, userId) => {
    return new Promise((resolve, reject) => {
        userService.fetchById(db, userId).then((users) => {
            betService.fetchByUser(db, users[0]).then((bets) => {
                resolve({
                    user: users[0],
                    bets: bets
                })
            });
        });
    });
}

module.exports = {
    fetchProfileBundle
}