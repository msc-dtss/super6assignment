
/**
 * Middleware that ensures the views always have access to `isDev`, `isLoggedIn` and the `user` object
 * @param {*} req The request
 * @param {*} res The response
 * @param {Function} next The next middleware function
 */
const viewAutoInjectData = (req, res, next) => {
    res.locals = {
        isDev: req.app.get('env') === 'development',
        loggedIn: !!req.session.user,
        user: req.session.user || null,
        error: req.session.error || null
    };
    next();
};

module.exports = viewAutoInjectData;