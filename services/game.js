/**
 * Fetch games matching a given criteria
 * @param {*} db The connection to the database
 * @param {*} criteria An object with the criteria to find the games
 * @return {Promise} A promise with an array
 */
const fetch = (db, criteria) => {
    return db
        .collection('games')
        .find(criteria)
        .toArray();
};

/**
 * Fetch games that have not happened yet
 * @param {*} db The connection to the database
 * @param {String} debugDate An optional date to pass in to ease debugging (unavailable in production mode)
 * @return {Promise} A promise with an array
 */
const fetchFuture = (db, debugDate) => {
    const now = debugDate && app.get('isDevelopment') ? new Date(debugDate) : new Date();
    const paddedMonth = now.getMonth() > 9 ? `${now.getMonth()}` : `0${now.getMonth()}`;
    const formattedDate = `${now.getFullYear()}/${paddedMonth}/${now.getDate()}`;
    return fetch(db, {
        gameDate: { $gt: formattedDate }
    });
};

module.exports = {
    fetch,
    fetchFuture
}