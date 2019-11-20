const viewAutoInjectData = (req, res, next) => {
    res.locals = {
        isDev: req.app.get('env') === 'development',
        loggedIn: !!req.session.user,
        user: req.session.user || null,
    };
    next();
};

module.exports = viewAutoInjectData;