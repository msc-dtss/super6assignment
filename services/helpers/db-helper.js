const ObjectId = require('mongodb').ObjectId;

/**
 * Generates a new mongodb ID.
 * @returns {String} A mongodb ID.
 */
const newId = () => {
    return new ObjectId().toString();
}

module.exports = {
    newId
}