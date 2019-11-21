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
    // Default to 1st September if no debug date since we have now passed end of tournament
    const now = debugDate ? new Date(debugDate) : new Date('2019-09-01');
    const oneIndexMonth = now.getMonth() + 1;
    const paddedMonth = oneIndexMonth > 9 ? `${oneIndexMonth}` : `0${oneIndexMonth}`;
    const paddedDay = now.getDate() > 9 ? `${now.getDate()}` : `0${now.getDate()}`;
    const formattedDate = `${now.getFullYear()}/${paddedMonth}/${paddedDay}`;

    const currentRoundInfo = await db.collection("rounds").find({
        "dateRange.start": { $lte: formattedDate },
        "dateRange.end": { $gte: formattedDate }
    }).sort({
        "dateRange.start": 1
    }).toArray();

    let nextRoundIndex = 0;
    if (currentRoundInfo.length > 0) {
        nextRoundIndex = currentRoundInfo[0].index + 1;
    };
    const nextRound = await db.collection("rounds").find({ index: { $eq: nextRoundIndex} }).toArray();
    if (nextRound.length > 0) {
        return await fetch(db, { $and: [{ "gameDate": { $gte: nextRound[0].dateRange.start } }, { "gameDate": { $lte: nextRound[0].dateRange.end } }] });
    }
    return [];
};

/**
 * Fetches all the games as a dictionary where each round is the key, each game date is a nested key and the value is an array of games
 * @param {*} db The connection to the database
 * @return {*} An object with all games grouped by round
 */
const fetchIndexedByRoundAndDate = async db => {
    const byRound = {};
    const games = await db.collection("games").find().sort({"gameDate": 1}).toArray();
    for (let i = 0; i < games.length; i++) {
        let game = games[i]
        let roundIndex = game.roundIndex;
        if (!(roundIndex in byRound)) {
            byRound[roundIndex] = [];
        }
        if(!(game.gameDate in byRound[roundIndex])){
            byRound[roundIndex][game.gameDate] = [];
        }
        byRound[roundIndex][game.gameDate].push(game);
    }
    return byRound;
};

module.exports = {
    fetch,
    fetchFuture,
    fetchIndexedByRoundAndDate
};
