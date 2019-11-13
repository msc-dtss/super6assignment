/**
 * Fetch games matching a given criteria
 * @param {*} db The connection to the database
 * @param {*} criteria An object with the criteria to find the games
 * @return {Array} An array
 */
const fetch = async (db, criteria) => {
    return await db
        .collection("games")
        .find(criteria)
        .toArray();
};

/**
 * Fetch games that have not happened yet
 * @param {*} db The connection to the database
 * @param {String} debugDate An optional date to pass in to ease debugging (unavailable in production mode)
 * @return {Array} An array of games
 */
const fetchFuture = async (db, debugDate) => { //TODO HANDLE WHEN THE REQUEST DATE IS ABOVE ANY GAMES IN THE DATABASE
    // Default to 20th September if no debug date since we have now passed end of tournament
    const now = debugDate ? new Date(debugDate) : new Date('2019-09-20');
    const oneIndexMonth = now.getMonth() + 1;
    const paddedMonth = oneIndexMonth > 9 ? `${oneIndexMonth}` : `0${oneIndexMonth}`;
    const paddedDay = now.getDate() > 9 ? `${now.getDate()}` : `0${now.getDate()}`;
    const formattedDate = `${now.getFullYear()}/${paddedMonth}/${paddedDay}`;

    let currentRoundInfo = await db.collection("rounds").find({
        "dateRange.start": { $lte: formattedDate },
        "dateRange.end": { $gte: formattedDate }
    }).toArray();

    if (currentRoundInfo.length === 0) {
        //Why are we redeclaring currentRoundInfo?
        let currentRoundInfo = await db.collection("rounds").find({
            "dateRange.start": {
                $gt: formattedDate
            }
        }).sort({
            "dateRange.start": 1
        }).toArray();
        currentRoundIndex = currentRoundInfo[0].index;
        nextRoundIndex = currentRoundIndex;
    } else {
        currentRoundIndex = currentRoundInfo[0].index;
        nextRoundIndex = currentRoundIndex + 1;
    };

    nextRound = await db.collection("rounds").find({ index: { $eq: nextRoundIndex } }).toArray();
    return await fetch(db, { $and: [{ "gameDate": { $gte: nextRound[0].dateRange.start } }, { "gameDate": { $lte: nextRound[0].dateRange.end } }] });
};

/**
 * Fetches all the games as a dictionary where each round is the key and the value is an array of games
 * @param {*} db The connection to the database
 * @return {*} An object with all games grouped by round
 */
const fetchIndexedByRound = async db => {
    const byRound = {};
    const games = await fetch(db, {});
    for (let i = 0; i < games.length; i++) {
        let round = games[i].round;
        let roundId = round.round_id;
        if (!(roundId in byRound)) {
            byRound[roundId] = [];
        }
        byRound[roundId].push(games[i]);
    }
    return byRound;
};

module.exports = {
    fetch,
    fetchFuture,
    fetchIndexedByRound
};
