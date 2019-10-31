
const express = require('express');

const cookieParser = require('cookie-parser');
const router = express.Router();
const usersList = require('../services/userslist')




router.get('/', function (req, res, next) {

    const userList= (req, res) => {
        let newUsersList = new usersList(req.body);
    
        newUsersList.save((err, collection) => {
            if (err) {
                res.send(error);
            }
            res.json(collection);
        });
    };


if (err) {
    res.send(err);
}
res.json(usersList);
});

 

module.exports = router
    
    
// POST endpoint

 .post(usersList);

    //POST endpoint
    
    // List all users - NO AUTH AT PRESENT (only for admin)


    // : move the code below to a service (much like service/games.js and such)
//     const db = req.app.get('super6db');
//     const collection = db.collection('users');
//     collection.find({}).toArray(function (err, docs) {
//         if (err) {
//             console.error(err);
//         }
//         res.json(docs)
//     });
// });

//POST endpoint

module.exports = router;
