const ObjectId = require('mongodb').ObjectId;

const newId = () => {
    return new ObjectId().toString();
}

module.exports = {
    newId
}