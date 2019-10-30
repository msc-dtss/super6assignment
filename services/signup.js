// TODO: move the code below to a service (much like service/games.js and such)
const userService = require('../services/users');
/**
 * Create user data
 * @param {*} db The connection to the database
 */

const makeUser = (email, password) => {
    const db = req.app.get('super6db');
    userService.createUser(db, email, password, false, function (error, result) {
        res.cookie('super6token', 'abcd1234', {
            maxAge: 3600000
        });
        res.redirect('../');
    }, function () {
        res.statusCode = 500;
        res.send('Error adding user');
    });
}

module.exports = {
    makeUser
};