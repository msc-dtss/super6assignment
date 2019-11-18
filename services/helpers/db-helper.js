const ObjectId = require('mongodb').ObjectId;

function newId(){
    return new ObjectId().toString();
}

module.exports = {
    newId
}