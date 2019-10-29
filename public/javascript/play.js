var placeBet = () => {
    var bet = getBetValues();
    console.log(bet)
    console.table(bet.games);
    return bet;
}

var getBetValues = () => {
    var bet = {
        "games": [],
        "goldenTrySelection": null
    };
    for (i = 0; i < 6; i++) {
        let teamATries = document.querySelector(`[game_block_${i}] input[team_A_tries]`)
        let teamBTries = document.querySelector(`[game_block_${i}] input[team_B_tries]`)
        let gameVictor = document.querySelector(`[game_block_${i}] select[game_winner]`)
        bet.games.push({
            teamATries: teamATries.value,
            teamBTries: teamBTries.value,
            gameVictor: gameVictor.value
        });
    };
    let goldenTryInput = document.querySelector('input[golden_try_input]');
    bet.goldenTrySelection = goldenTryInput.value;
    return bet;
};