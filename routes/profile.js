const express = require("express");
const userProfileService = require("../services/profile");
const wrap = require("./helpers/exceptionHandler").exceptionWrapper;

const router = express.Router();
// TODO once user session Id is working correctly use this code structure below.
// router.get('/', wrap(async (req, res, next) => {
//     // Should show the user profile page
//     const db = req.app.get('super6db');
//     const userInfo = await userProfileService.fetchProfileBundle(db, req.session.userId);
//     res.render('profile', {
//         title: 'user name',
//         response: userInfo,
//         loggedIn: !!req.session.user,
//         user: req.session.user || null
//     });
// }));

// TEST CODE ONLY
router.get(
  "/",
  wrap((req, res, next) => {
    res.render("profile", {
      title: "user name",
    });
  })
);

module.exports = router;
