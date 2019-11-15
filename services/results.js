
const betsService = require('../services/bets');

/**
 * Cache to hold the results. So we don't have to fetch them all the time (and in case the API is unavailable).
 */
let resultsCache = [];

/**
 * Refreshes the results by forcing a refresh of the results cache and also scores all unscored bets.
 * @param {*} db The db connection
 */
const refreshResults = async (db) => {
    const unscoredBets = await betsService.fetchUnscoredBets(db);
    resultsCache = await getResults(true);
    await betsService.score(db, unscoredBets, resultsCache);
}

/**
 * The purpose of this is to simulate getting the results from an API.
 * We looked at using live API results but the rugby championship has passed :(
 * @returns {Array} An array with all the results
 */
const getResultsFromApi = async () => {
    return new Promise((resolve, reject) => {
        //Any transformation that we would need should've happen here.
        resolve(
            [
                {
                    roundIndex: 0,
                    games: [
                        {
                            gameId: '5dbb5ba824a8c8398c3a0f8b',
                            winTeam: 'Japan',
                            teamAScore: 30,
                            teamBScore: 10,
                            teamATries: 4,
                            teamBTries: 1
                        },
                        {
                            gameId: '5dbb5ba824a8c8398c3a0f8d',
                            winTeam: 'Canada',
                            teamAScore: 12,
                            teamBScore: 5,
                            teamATries: 1,
                            teamBTries: 0
                        }
                    ]
                }
            ]
        );
    });
}


/**
 * Fetches the cached game results. If `isForced` is `true` then it will refresh the cache with the new results before returning it.
 * @param {boolean} isForced
 * @returns {Array} The array of results
 */
const getResults = async (isForced) => {
    if(isForced){
        resultsCache = await getResultsFromApi();
    }
    return resultsCache;
};

/**
 * Fetches the games from the cached results. If `isForced` is `true` then it will refresh the cache with the new results before returning.
 * @param {boolean} isForced 
 * @returns {*} A json object of each game indexed by the game Id
 */
const getGameResults = async (isForced) => {
    if(isForced){
        resultsCache = await getResultsFromApi();
    }

    const gameResults = resultsCache
        .reduce((acc, result)=>{
            return [...acc, ...result.games];
        }, [])
        .reduce((acc, game) => {
            acc[game.gameId] = game;
            return acc;
        }, {});
    
    return gameResults;
};

const getGoldenTryResults = async () => {
    return new Promise((resolve, reject) => {
        resolve(
            {
                '5dc9d60cc46c6d373ce167fd': {
                    goldenTry: 13
                }

            }
        );
    });
};

module.exports = {
    getGameResults,
    getGoldenTryResults,
    refreshResults
};