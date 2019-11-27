/**
 * Grabs the betting values from the form and sends them to the server
 * @param {*} roundIndex The round index which the user is betting on.
 * @param {*} nrGames The number of Games which the user is betting on (should always be 6).
 */
var placeBet = function (roundIndex, nrGames) {
    var bet = getBetValues(roundIndex, nrGames);
    makeRequest("/bets",
        "POST",
        function () {
            window.location.href = '/profile';
        },
        function (httpStatusCode, responseText, responseJson) {
            //failed function
        },
        bet);
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
        var teamATries = document.querySelector(`[game_block_${i}] input[team_A_tries]`);
        var teamBTries = document.querySelector(`[game_block_${i}] input[team_B_tries]`);
        var gameVictor = document.querySelector(`[game_block_${i}] select[game_winner]`);
        var gameId = document.querySelector(`[game_block_${i}]`).getAttribute("game_id");
        bet.games.push({
            id: gameId,
            teamATries: teamATries.value,
            teamBTries: teamBTries.value,
            gameVictor: gameVictor.value
        });
    }
    var goldenTryInput = document.querySelector("input[golden_try_input]");
    bet.goldenTrySelection = goldenTryInput.value;
    return bet;
};


/**
 * Selects the game victor
 * @param {*} gameTeam The element that contains the team representation (flag and such) or the "vs" element
 * @param {*} type `draw` or `null`/`undefined`. By default this assumes you're trying to set the loser/winner. With `draw` it sets the bet to a draw
 */
var select = function (gameTeam, type) {
    var resetClass = type === "draw" ? "draw" : "loser";
    var resetText = type === "draw" ? "Draw" : "Loser";
    var bothTeams = gameTeam.parentElement.querySelectorAll("[team_win_selector]");
    for (var i = 0; i < bothTeams.length; i++) {
        bothTeams[i].classList.remove("winner");
        bothTeams[i].classList.remove("loser");
        bothTeams[i].classList.remove("draw");
        bothTeams[i].classList.add(resetClass);
        bothTeams[i].querySelector("[bet_winner_selection]").innerHTML = resetText;
    }

    var value = type === "draw" ? "draw" : gameTeam.getAttribute("team_name");
    var info = gameTeam.querySelector("[bet_info]") || gameTeam;
    var blockNumber = info.getAttribute("block_number");

    var selector = document.querySelector("[game_block_" + blockNumber + "]").querySelector("[game_winner]");
    if (!!selector) {
        selector.value = value;
    }

    if (type !== "draw") {
        gameTeam.classList.remove(resetClass);
        gameTeam.classList.add("winner");
        gameTeam.querySelector("[bet_winner_selection]").innerHTML = "Victor";
    }
}

/**
 * Attach the winner/loser selection event listener to each flag
 */
var attachVictorListeners = function () {
    var selectors = document.querySelectorAll("[is_writable='true']>[team_win_selector]");
    for (var i = 0; i < selectors.length; i++) {
        selectors[i].addEventListener('click', function (event) {
            if (event.srcElement.tagName.toLowerCase() !== "input" && event.srcElement.tagName.toLowerCase() !== "label") {
                select(this);
            }
        });
    }
}

/**
 * Attach the draw selection event listener to the vs element
 */
var attachTieListeners = function () {
    var selectors = document.querySelectorAll("[is_writable='true']>[team_draw_selector]");
    for (var i = 0; i < selectors.length; i++) {
        selectors[i].addEventListener('click', function (event) {
            if (event.srcElement.tagName.toLowerCase() !== "input" && event.srcElement.tagName.toLowerCase() !== "label") {
                select(this, "draw");
            }
        });
    }
}

/**
 * Attach the help toggles to the help buttons
 */
var attachHelpListeners = function () {
    var helpBtns = document.querySelectorAll("[help_toggle]");
    for (var i = 0; i < helpBtns.length; i++) {
        helpBtns[i].addEventListener('click', function (event) {
            var helpMessages = document.querySelectorAll(this.getAttribute("help_toggle"));
            for (var j = 0; j < helpMessages.length; j++) {
                if (helpMessages[j].classList.contains("invisible")) {
                    helpMessages[j].classList.remove("invisible");
                } else {
                    helpMessages[j].classList.add("invisible");
                }
            }
        });
    }
}

/**
 * Fills the values with the bet information
 */
var fillSelection = function (betInfo) {
    var keys = Object.keys(betInfo)
    for (var i = 0; i < keys.length; ++i) {
        if (betInfo[keys[i]].winTeam === "draw") {
            select(document.querySelector("[game_id='" + keys[i] + "']")
                .querySelector("[team_draw_selector]"), "draw");
        } else {
            select(document.querySelector("[game_id='" + keys[i] + "']")
                .querySelector("[team_name='" + betInfo[keys[i]].winTeam + "']"));
        }
    };
};


attachVictorListeners();
attachTieListeners();
attachHelpListeners();
