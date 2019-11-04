const express = require('express');
const userProfileService = require('../services/profile');
const router = express.Router();

router.get('/', async (req, res, next) => {
    // Should show the user profile page
    const db = req.app.get('super6db');
    const userInfo = await userProfileService.renderProfilePage(db, req.session.userId);
    res.render('profile', {
        title: 'user name',
        response: response,
        loggenIn: true
    });
});

module.exports = router;