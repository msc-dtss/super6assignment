/**
 * @param {*} content The array containing all of the user's bets.
 */
var makeRequest = function (content) {
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        alert("Giving up :( Cannot create an XMLHTTP instance");
        return false;
    } else {
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4 && httpRequest.status === 200) {
                console.log(httpRequest.responseText);
            }
        };
        httpRequest.open("POST", "/bets");
        httpRequest.setRequestHeader("Content-Type", "application/json");
        httpRequest.send(JSON.stringify(content));
    }
};

/**
 * @param {*} roundId The round Id which the user is betting on.
 * @param {*} nrGames The number of Games which the user is betting on (should always be 6).
 */
var placeBet = function (roundId, nrGames) {
    var bet = getBetValues(roundId, nrGames);
    console.log(bet);
    console.table(bet.games);
    makeRequest(bet);
};

/**
 * @param {*} roundId The round Id which the user is betting on.
 * @param {*} nrGames The number of Games which the user is betting on (should always be 6).
 */
var getBetValues = function (roundId, nrGames) {
    var bet = {
        roundId: roundId,
        games: [],
        goldenTrySelection: null
    };
    for (i = 0; i < nrGames; i++) {
        var teamATries = document.querySelector(
            `[game_block_${i}] input[team_A_tries]`
        );
        var teamBTries = document.querySelector(
            `[game_block_${i}] input[team_B_tries]`
        );
        var gameVictor = document.querySelector(
            `[game_block_${i}] select[game_winner]`
        );
        bet.games.push({
            teamATries: teamATries.value,
            teamBTries: teamBTries.value,
            gameVictor: gameVictor.value
        });
    }
    var goldenTryInput = document.querySelector("input[golden_try_input]");
    bet.goldenTrySelection = goldenTryInput.value;
    return bet;
};
