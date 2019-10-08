const bcrypt = require('bcrypt');

function getHashedPassword(password){
    // Turn the password into a hash using the one-way bcrypt algo with salt.
    // Password will be saved as a hash and login will be verified by comparing hashed passwords.
    let hash = bcrypt.hashSync(password, 10);
    return hash;
}

function createUser(db, email, plainTextPassword, onCreate){
    // Save a new user to the database
    // Using email as identifier so ensure it doesn't exist before saving - to do
    let id = db.collection('users').insertOne({ email: email, password: getHashedPassword(plainTextPassword)}, onCreate);
}

function login(){
    // Check user creds against the database and issue a token
}

function verifyToken(){
    // Verify token is valid and not expired
}

function isAdmin(){
    // For authorization - check the token belongs to an admin user (and is valid an not expired)
    // Use this to check a user is allowed to use any admin functions
}

function logout(){
    // Disable/delete the users token so it no longer works
    // User will require username and password again to gain access.
}

module.exports = {createUser};