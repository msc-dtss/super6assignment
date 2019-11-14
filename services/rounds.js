/**
 * Fetch rounds matching a given criteria
 * @param {*} db The connection to the database
 * @param {*} criteria An object with the criteria to find the games
 * @return {Array} An array
 */
const fetch = async (db, criteria) => {
    return await db
        .collection("rounds")
        .find(criteria)
        .toArray();
};

/**
 * Fetch rounds by the round number
 * @param {} db The connecion to the database
 */
const fetchRoundsByIndex = async(db) => {
    const rounds = {};
    const dbRounds = await fetch(db, {});
    dbRounds.forEach(dbRound => {
        rounds[dbRound.index] = dbRound;
    });
    return rounds;
}

module.exports = {
    fetch,
    fetchRoundsByIndex
};
