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
const fetchFuture = async (db, debugDate) => {
  const now = debugDate ? new Date(debugDate) : new Date();
  const oneIndexMonth = now.getMonth() + 1;
  const paddedMonth = oneIndexMonth > 9 ? `${oneIndexMonth}` : `0${oneIndexMonth}`;
  const paddedDay = now.getDate() > 9 ? `${now.getDate()}` : `0${now.getDate()}`;
  const formattedDate = `${now.getFullYear()}/${paddedMonth}/${paddedDay}`;
  // return await fetch(db, {
  //   $and: [{ gameDate: { $gt: formattedDate } }, { roundId: { $gt: 2 } }] //TODO THIS NEEDS FIXING!
  // });
  return await fetch(db, { gameDate: { $gt: formattedDate } });
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
    if (!(games[i].roundId in byRound)) {
      byRound[games[i].roundId] = [];
    }
    byRound[games[i].roundId].push(games[i]);
  }
  return byRound;
};

module.exports = {
  fetch,
  fetchFuture,
  fetchIndexedByRound
};
