const dateHelper = require('./helpers/date-helpers');

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
 * Fetch rounds matching the provided index
 * @param {*} db The connecion to the database
 * @param {Number} roundIndex The index of the round we want to get from the database
 * @returns {Array} Collection of rounds (should contain one element or be empty)
 */
const fetchByIndex = async (db, roundIndex) => {
    return await fetch(db, { index: roundIndex });
};

//todo
const fetchCurrentRound = async(db, debugDate) => {
    const todaysDate = !debugDate ? dateHelper.getToday() : dateHelper.formatDate(new Date(debugDate));
    let currentRound = await fetch(db, {
        "dateRange.start": { $lte: todaysDate },
        "dateRange.end": { $gte: todaysDate }
    });
    if(currentRound.length === 0) {
        currentRound = await db.collection("rounds").find({
            "dateRange.start": { $gte: todaysDate }
        }).sort({
            "dateRange.start": 1
        }).toArray();
    }
    if(currentRound.length === 0) {
        return null; 
    }
    return currentRound[0];
}

//todo
const fetchFutureSorted = async(db, date) => {
    return await db.collection("rounds").find({
        "dateRange.start": { $lte: date },
        "dateRange.end": { $gte: date }
    }).sort({
        "dateRange.start": 1
    }).toArray();
}

/**
 * Fetch rounds into a map indexed by the round index
 * @param {*} db The connecion to the database
 * @returns {*} An object containing each round indexed by it's Index
 */
const fetchIndexedByIndex = async(db) => {
    const rounds = {};
    const dbRounds = await fetch(db, {});
    dbRounds.forEach(dbRound => {
        rounds[dbRound.index] = dbRound;
    });
    return rounds;
}

module.exports = {
    fetch,
    fetchIndexedByIndex,
    fetchByIndex,
    fetchFutureSorted,
    fetchCurrentRound
};
