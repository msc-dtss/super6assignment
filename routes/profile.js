const express = require('express');
const userProfileService = require('../services/profile');
const router = express.Router();

router.get('/', function (req, res, next) {
    // Should show the user profile page
    const db = req.app.get('super6db');
    userProfileService.renderProfilePage(db, req.session.userId)
        .then((users) => {
            res.render('profile', {
                title: 'user name',
                response: response,
                loggenIn: true
            });
        })
});

module.exports = router;