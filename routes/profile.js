const express = require("express");
const userProfileService = require("../services/profile");
const wrap = require("./helpers/exceptionHandler").exceptionWrapper;

const router = express.Router();
router.get('/', wrap(async (req, res, next) => {
    // Should show the user profile page
    const db = req.app.get('super6db');
    const userInfo = await userProfileService.fetchProfileBundle(db, req.session.user._id);
    res.render('profile', {
        title: req.session.user.firstName,
        response: userInfo,
        loggedIn: !!req.session.user,
        user: req.session.user || null
    });
}));

module.exports = router;
