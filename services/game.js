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
 * @param {Number} round ????
 * @return {Array} An array of games
 */
const fetchGamesForRound = async (db, round) => {
    return await fetch(db, { round_id: round });
};

/**
 * TODO: Document
 * @param {*} db The connection to the database
 * @param {Array<Number>} roundList ????
 * @return {*} An array of games by round
 */
const fetchByRound = async (db, roundList) => {
    const byRound = {};
    //This will be a lot more performant if we query with all the rounds and then reorganize the data once we have it all
    for (let round = 0; round <= roundList.length; round++) {
        byRound[round] = await fetchGamesForRound(db, round);
    }
    return byRound;
};


module.exports = {
    fetch,
    fetchFuture,
    fetchByRound
};
