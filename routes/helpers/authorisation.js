const config = require('../../config/authorisation.json');
const errors = require('../../errors/super6exceptions');

/**
 * Checks if `text` matches a regular expression in `regexList`. Sort of like a `.includes` but with regex.
 * (Might move it out if needed elsewhere.)
 * @param {Array} regexList An array of regular expressions to match with `text`
 * @param {String} text The text we want to see if it's matches any of the regular expressions
 * @returns {Boolean} True when `text` matches a regular expression in `regexList`
 */
const regexIncludes = (regexList, text) => {
    for (let i = 0; i < regexList.length; i++) {
        if (regexList[i].match(text)) {
            return true;
        }
    };
    return false;
};


/**
 * Check whether or not a user is allowed to access a given route
 * @param {*} user The user session information
 * @param {String} path The path of the route that is being accessed
 * @param {*} paths An object containing the keys:
 *                  * `public` - Contains a list of regex to identify the public routes
 *                  * `admin` - Contains a list of regex to identify the routes that only admin users can go to
 * @returns {Boolean} True if the user is allowed access to that route
 */
const _isAuthorised = (user, path, paths) => {
    // Open public routes
    if (regexIncludes(paths.public, path)) {
        return true;
    }

    // Restrict admin-only routes
    if (user && regexIncludes(paths.admin, path)) {
        return user.isAdmin;
    }

    // Only allow any other route if the user is logged in
    return !!user;
});

/**
 * Check whether or not a user is allowed to access a given route
 * @param {*} user The user session information
 * @param {String} path The path of the route that is being accessed
 * @returns {Boolean} True if the user is allowed access to that route
 */
const isAuthorised = (user, path) => {
    return _isAuthorised(user, paths, config.routes);
};


/**
 * Middleware function to block access if a user does not have access to a route.
 * Will execute the `next()` middleware if the user has access.
 * @param {*} req The request
 * @param {*} res The response
 * @param {Function} next The next middleware function
 * @throws {errors.UnauthorizedException} When the user is unauthorised. This will be picked up by the error handler (see `app.js`)
 */
const verifyAuthorisation = (req, res, next) => {
    if (isAuthorised(req.session.user, req.path)) {
        next();
    }
    else{
        throw new errors.UnauthorizedException();
    }
};

module.exports = {
    verify: verifyAuthorisation,
    _isAuthorised
}