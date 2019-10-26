var placeBet = () => {
    var bet = getBetValues();
    console.log(bet);
    return bet;
}

var getBetValues = () => {
        var bet = {
            "userId": "",
            "roundId": 1,
            "games": []
        };
        for (i = 0; i < 6; i++) {
            let teamATries = document.querySelector(`[game_block_${i}] input[team_A_tries]`)
            let teamBTries = document.querySelector(`[game_block_${i}] input[team_B_tries]`)
            let game1Victor = document.querySelector(`[game_block_${i}] select[game_1_winner]`)
            bet.games.push({
                teamATries: teamATries.value,
                teamBTries: teamBTries.value,
                game1Victor: game1Victor.value
            });
        };
        let goldenTryInput = document.querySelector('input[golden_try_input]');
        bet.games.push({
                goldenTrySelection: goldenTryInput.value
        });
            return bet;
        };