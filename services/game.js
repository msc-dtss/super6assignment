/**
 * Fetch games matching a given criteria
 * @param {*} app The express app
 * @param {*} criteria An object with the criteria to find the games
 * @return {Game}
 */
const fetchGames = (app, criteria) => {
    const db = app.get(super6db)
    return db.collection('games')
        .find(criteria);
}

/**
 * Fetch games that have not happened yet
 * @param {*} app The express app
 * @param {*} criteria An object with the criteria to find the games
 * @return {Game}
 */
const fetchFutureGames = (app) => {
    const now = new Date();
    return fetchGames(app, {
        gameDate: { $gt: now }
    });
}