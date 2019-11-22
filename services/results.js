
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
        //This would be what we'd get from the API.
        const apiResult = [
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
                        gameId: '5dbb5ba824a8c8398c3a0f96',
                        winTeam: 'Australia',
                        teamAScore: 39,
                        teamBScore: 21,
                        teamATries: 6,
                        teamBTries: 2
                    },
                    {
                        gameId: '5dbb5ba824a8c8398c3a0fa1',
                        winTeam: 'France',
                        teamAScore: 23,
                        teamBScore: 21,
                        teamATries: 2,
                        teamBTries: 2
                    },
                    {
                        gameId: '5dbb5ba824a8c8398c3a0fac',
                        winTeam: 'NewZealand',
                        teamAScore: 23,
                        teamBScore: 13,
                        teamATries: 2,
                        teamBTries: 1
                    },
                    {
                        gameId: '5dbb5ba824a8c8398c3a0f8d',
                        winTeam: 'Italy',
                        teamAScore: 48,
                        teamBScore: 7,
                        teamATries: 7,
                        teamBTries: 1
                    },
                    {
                        gameId: '5dbb5ba824a8c8398c3a0fae',
                        winTeam: 'Italy',
                        teamAScore: 47,
                        teamBScore: 22,
                        teamATries: 7,
                        teamBTries: 3
                    }
                ],
                goldenTry: 5
            },
            {
                roundIndex: 1,
                games: [
                    {
                        gameId: '5dbb5ba824a8c8398c3a0faf',
                        winTeam: 'Ireland',
                        teamAScore: 27,
                        teamBScore: 3,
                        teamATries: 4,
                        teamBTries: 0
                    },
                    {
                        gameId: '5dbb5ba824a8c8398c3a0fb0',
                        winTeam: 'England',
                        teamAScore: 35,
                        teamBScore: 3,
                        teamATries: 4,
                        teamBTries: 0
                    },
                    {
                        gameId: '5dbb5ba824a8c8398c3a0fb1',
                        winTeam: 'Wales',
                        teamAScore: 43,
                        teamBScore: 14,
                        teamATries: 6,
                        teamBTries: 2
                    },
                    {
                        gameId: '5dbb5ba824a8c8398c3a0fb2',
                        winTeam: 'Samoa',
                        teamAScore: 9,
                        teamBScore: 34,
                        teamATries: 0,
                        teamBTries: 6
                    },
                    {
                        gameId: '5dbb5ba824a8c8398c3a0f8c',
                        winTeam: 'Uruguay',
                        teamAScore: 27,
                        teamBScore: 30,
                        teamATries: 5,
                        teamBTries: 3
                    },
                    {
                        gameId: '5dbb5ba824a8c8398c3a0f8e',
                        winTeam: 'England',
                        teamAScore: 45,
                        teamBScore: 7,
                        teamATries: 7,
                        teamBTries: 1
                    }
                ],
                goldenTry: 5
            }
        ];
        //Any transformation that we would need should happen here.
        resolve(apiResult);
    });
}


/**
 * Fetches the cached game results. If `isForced` is `true` then it will refresh the cache with the new results before returning it.
 * @param {boolean} isForced
 * @returns {Array} The array of results
 */
const getResults = async (isForced) => {
    if (isForced) {
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
    if (isForced) {
        resultsCache = await getResultsFromApi();
    }

    const gameResults = resultsCache
        .reduce((acc, result) => {
            return [...acc, ...result.games];
        }, [])
        .reduce((acc, game) => {
            acc[game.gameId] = game;
            return acc;
        }, {});

    return gameResults;
};


/**
 * Returns the goldenTry results 
 * @returns {*} A json object of round indexed by it's roundIndex
 */
const getGoldenTryResults = async (isForced) => {
    if (isForced) {
        resultsCache = await getResultsFromApi();
    }
    return resultsCache.reduce((acc, result) => {
        acc[result.roundIndex] = result.goldenTry;
        return acc;
    }, {});
};

module.exports = {
    getGameResults,
    getGoldenTryResults,
    refreshResults
};