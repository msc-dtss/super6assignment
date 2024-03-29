
/**
 * This method wraps async routes so that we can catch their exceptions and forward them to the appropriate exception handler.
 * @param {express.Router} route 
 */
const exceptionWrapper = (route) => {
    return (req, res, next) => {
        return Promise.resolve(route(req, res, next)).catch(next);
    };
};

module.exports = {
    exceptionWrapper
}