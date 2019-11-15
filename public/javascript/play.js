/**
 * Creates and sends the request with the bet details
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
 * Grabs the betting values from the form and sends them to the server
 * @param {*} roundIndex The round index which the user is betting on.
 * @param {*} nrGames The number of Games which the user is betting on (should always be 6).
 */
var placeBet = function (roundIndex, nrGames) {
    var bet = getBetValues(roundIndex, nrGames);
    makeRequest(bet);
};

/**
 * Gets the values from the input fields and builds them up into a json structure to be sent to the server.
 * @param {*} roundIndex The round index which the user is betting on.
 * @param {*} nrGames The number of Games which the user is betting on (should always be 6).
 * @returns {*} A JSON structure with the roundIndex, the game tries and victor and the golden try.
 */
var getBetValues = function (roundIndex, nrGames) {
    var bet = {
        roundIndex: roundIndex,
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
