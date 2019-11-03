/**
 * Fetch games matching a given criteria
 * @param {*} db The connection to the database
 * @param {*} criteria An object with the criteria to find the games
 * @return {Array} An array
 */
const fetch = async (db, criteria) => {
    return await db
        .collection('games')
        .find(criteria)
        .toArray();
};

/**
 * Fetch games that have not happened yet
 * @param {*} db The connection to the database
 * @param {String} debugDate An optional date to pass in to ease debugging (unavailable in production mode)
 * @return {Array} An array of games
 */
const fetchFuture = async (db, debugDate) => {
    const now = debugDate ? new Date(debugDate) : new Date();
    const paddedMonth = now.getMonth() > 9 ? `${now.getMonth()}` : `0${now.getMonth()}`;
    const formattedDate = `${now.getFullYear()}/${paddedMonth}/${now.getDate()}`;
    return await fetch(db, {
        gameDate: { $gt: formattedDate }
    });
};

/**
 * TODO: Document
 * @param {*} db The connection to the database
 * @return {*} An array of games by round
 */
const fetchIndexedByRound = async (db) => {
    const byRound = {};
    const games = await fetch(db, {});
    for (let i = 0; i < games.length; i++) {
        if (!(games[i].round_id in byRound)) {
            byRound[games[i].round_id] = [];
        }
        byRound[games[i].round_id].push(games[i]);
    }
    return byRound;
};


module.exports = {
    fetch,
    fetchFuture,
    fetchIndexedByRound
};
