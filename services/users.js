const bcrypt = require("bcrypt");
const crypto = require("crypto");
const session = require("express-session");

function getHashedPassword(password) {
    // Turn the password into a hash using the one-way bcrypt algo with salt.
    // Password will be saved as a hash and login will be verified by comparing hashed passwords.
    let hash = bcrypt.hashSync(password, 10);
    return hash;
}

async function createUser(db, email, plainTextPassword, isAdmin, onCreate, onFail) {
    // Save a new user to the database
    // Using email as identifier so ensure it doesn't exist before saving - to do

    let exists = await userExists(db, email);

    if (!exists) {
        let id = db.collection('users').insertOne({ email: email, password: getHashedPassword(plainTextPassword), isAdmin: isAdmin }, onCreate);
    } else {
        onFail();
    }
}

async function userExists(db, email) {
    let user = await db.collection('users').findOne({ email: email });
    return user != null;
}

async function checkLogin(email, password) {
    // Check user creds against the database
    let user = await db.collection('users').findOne({ email: email });
    return bcrypt.compareSync(password, user.password);

}

module.exports = { createUser };
module.exports = { userExists };
module.exports = { checkLogin };
