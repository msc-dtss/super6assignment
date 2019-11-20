const config = require('../../config/authorisation.json');
const errors = require('../../errors/super6exceptions');

const regexIncludes = (paths, path) => {
    for (let i = 0; i < paths.length; i++) {
        if (paths[i].match(path)) {
            return true;
        }
    };
    return false;
};

const isAuthorised = (user, path) => {
    // Open public routes
    if (regexIncludes(config.routes.public, path)) {
        return true;
    }

    // Restrict admin-only routes
    if (user && regexIncludes(config.routes.admin, path)) {
        return user.isAdmin;
    }

    // Only allow any other route if the user is logged in
    return !!user;
};

const verifyAuthorisation = (req, res, next) => {
    if (isAuthorised(req.session.user, req.path)) {
        next();
    }
    else{
        throw new errors.UnauthorizedException();
    }
};

module.exports = verifyAuthorisation;