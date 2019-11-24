function displayEditBetAlert(e) {
    document.querySelector('.edit_bet_button').style.display = 'none';
    document.querySelector('.edit_bet_alert').style.display = 'block';
};

function yesAlertSelect(e) {
    console.log(document.response) //Why is response not defined here?
};

function noAlertSelect(e) {
    document.querySelector('.edit_bet_button').style.display = 'block';
    document.querySelector('.edit_bet_alert').style.display = 'none';
};