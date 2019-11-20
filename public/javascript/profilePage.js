function editTheBets(e) {

    document.querySelector('.edit_bet_button').style.display = 'none';
    document.querySelector('.save_bet_button').style.display = 'block';

    let fullList = document.querySelectorAll(".bets_text");
    if (fullList) {
        for (let i = 0; i < fullList.length; i++) {
            fullList[i].style.display = "none";
            let betList = document.querySelectorAll(".bets_edit");
            betList[i].style.display = "block";
        };
    };
};

function saveTheBets (e) {
    document.querySelector('.edit_bet_button').style.display = 'block';
    document.querySelector('.save_bet_button').style.display = 'none';
};