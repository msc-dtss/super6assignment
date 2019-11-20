const express = require("express");
const userProfileService = require("../services/profile");
const wrap = require("./helpers/exceptionHandler").exceptionWrapper;

const router = express.Router();
// router.get('/', wrap(async (req, res, next) => {
//     // Should show the user profile page
//     const db = req.app.get('super6db');
//     const userInfo = await userProfileService.fetchProfileBundle(db, req.session.user._id);
//     res.render('profile', {
//         title: 'user name',
//         response: userInfo,
//         loggedIn: !!req.session.user,
//         user: req.session.user || null
//     });
// }));

//TESTING CODE ONLY
router.get('/', wrap(async (req, res, next) => {
    res.render('profile', {
        title: 'Profile Page',
        response: {
            bets: [
                {"_id": "5dd2fc542a5e4928183c4f85","userId": "5dd1c029f05a9b161cabbef6","roundIndex": 1,"gameBets": [{"id": "5dbb5ba824a8c8398c3a0f8c","teamATries": 3,"teamBTries": 6,"winTeam": "Fiji","points": 9},{"id": "5dbb5ba824a8c8398c3a0f8e","teamATries": 7,"teamBTries": 1,"winTeam": "England","points": 2},{"id": "5dbb5ba824a8c8398c3a0faf","teamATries": 4,"teamBTries": 2,"winTeam": "Ireland","points": 0},{"id": "5dbb5ba824a8c8398c3a0fb0","teamATries": 8,"teamBTries": 1,"winTeam": "England","points": 2},{"id": "5dbb5ba824a8c8398c3a0fb1","teamATries": 0,"teamBTries": 1,"winTeam": "Georgia","points": "0"},{"id": "5dbb5ba824a8c8398c3a0fb2","teamATries": 2,"teamBTries": 1,"winTeam": "Russia","points": 7}],"goldenTry": 2,"points": 27,"CsTest": "true"}
            ],
            round: [
                { "_id": "5dc9d71ba48afe373caee7e3", "index": 1, "dateRange": { "start": "2019/09/23", "end": "2019/09/25" } }
            ],
            games: [
                { "_id": "5dbb5ba824a8c8398c3a0f8c", "teamA": { "name": "Fiji", "flag": "fiji.svg" }, "teamB": { "name": "Uruguay", "flag": "uruguay.svg" }, "gameDate": "2019/09/25", "roundIndex": 1 },
                { "_id": "5dbb5ba824a8c8398c3a0f8e", "teamA": { "name": "England", "flag": "england.svg" }, "teamB": { "name": "USA", "flag": "usa.svg" }, "gameDate": "2019/09/25", "roundIndex": 1 },
                { "_id": "5dbb5ba824a8c8398c3a0faf", "teamA": { "name": "Ireland", "flag": "ireland.svg" }, "teamB": { "name": "Scotland", "flag": "scotland.svg" }, "gameDate": "2019/09/23", "roundIndex": 1 },
                { "_id": "5dbb5ba824a8c8398c3a0fb0", "teamA": { "name": "England", "flag": "england.svg" }, "teamB": { "name": "Tonga", "flag": "tonga.svg" }, "gameDate": "2019/09/23", "roundIndex": 1 },
                { "_id": "5dbb5ba824a8c8398c3a0fb1", "teamA": { "name": "Wales", "flag": "wales.svg" }, "teamB": { "name": "Georgia", "flag": "georgia.svg" }, "gameDate": "2019/09/23", "roundIndex": 1 },
                { "_id": "5dbb5ba824a8c8398c3a0fb2", "teamA": { "name": "Russia", "flag": "russia.svg" }, "teamB": { "name": "Samoa", "flag": "samoa.svg" }, "gameDate": "2019/09/24", "roundIndex": 1 }
            ],
            totalPoints: 58,
            totalBets: 2,
            roundIndex: 1,
            todaysDate: "20/08/2019",
            },
        user: { "_id": "5dd1c029f05a9b161cabbef6", "email": "bob@hello.com", "password": "$2b$10$KjIMxK98etqsaQ6BOCb/DOHSnTESkffKUlIOfMJahZWOf/N//Vx9a", "firstName": "chris", "surname": "smith", "isAdmin": false, "isActive": true },
    });
}));

module.exports = router;
