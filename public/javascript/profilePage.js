var displayEditBetAlert = function (e) {
    document.querySelector('[edit_bet_alert]').style.display = 'block';
};

var yesAlertSelect = function (betId) {
        location.href = "/bets/play/" + betId;
};
var noAlertSelect = function (e) {
    document.querySelector('[edit_bet_alert]').style.display = 'none';
};