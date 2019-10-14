/**
 * Fetch games matching a given criteria
 * @param {*} app The express app
 * @param {*} criteria An object with the criteria to find the games
 * @return {Promise} A promise with an array
 */
const fetch = (app, criteria) => {
    const db = app.get('super6db')
    return db
        .collection('games')
        .find(criteria)
        .toArray();
}

/**
 * Fetch games that have not happened yet
 * @param {*} app The express app
 * @return {Promise} A promise with an array
 */
const fetchFuture = (app) => {
    const now = new Date();
    const paddedMonth = now.getMonth() > 9 ? `${now.getMonth()}` : `0${now.getMonth()}`;
    const formattedDate = `${now.getFullYear()}/${paddedMonth}/${now.getDate()}`;
    return fetch(app, {
        gameDate: { $gt: formattedDate }
    });
}

module.exports = {
    fetch,
    fetchFuture
}