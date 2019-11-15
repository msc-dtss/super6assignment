const bcrypt = require('bcrypt');
const errors = require('../errors/super6exceptions');

/**
 * Fetch users matching a given criteria
 * @param {*} db The connection to the database
 * @param {*} criteria An object with the criteria to find the users
 * @return {Array} An Array with users
 */
const fetch = async (db, criteria) => {
    return await db
        .collection('users')
        .find(criteria)
        .toArray();
};

/** 
 * fetch user details for session, exlcuding password
 * @param {*} db database
 * @param {*} email email input
 * @return {Array}
*/
const fetchUser = async (db, email) => {
    const users = await db
        .collection('users')
        .find({ email: email })
        .project({ _id: 1, email: 1, firstName: 1, surname: 1 })
        .toArray()
    return users.length > 0 ? users[0] : null;
};


/**
 * Fetch a user by id
 * @param {*} db The connection to the database
 * @param {*} userId The ID of the user
 * @return {*} An object with the user information
 * @throws {erros.UserNotFoundError} When no user is found
 */
const fetchById = async (db, userId) => {
    const users = await fetch(db, {
        _id: userId
    });
    if (users.length === 0) {
        throw new errors.UserNotFoundError();
    }
    return users[0]; //Should only have one, really
};

/**
 * Fetch a user by email
 * @param {*} db The connection to the database
 * @param {*} email The email of a user
 * @param {*} activeUsersOnly Filter the results by listing only active users
 * @return {*} An object with the user information
 * @throws {erros.UserNotFoundError} When no user is found
 */
const fetchByEmail = async (db, email, activeUsersOnly) => {
    let users = []
    if(activeUsersOnly){
        users = await fetch(db, { email, isActive: true });
    } else {
        users = await fetch(db, { email });
    }
    if (users.length === 0) {
        throw new errors.UserNotFoundError();
    }
    return users[0] || null;
};

/**
 * Turn the password into a hash using the one-way bcrypt algo with salt.
 * @param {string} password The clear-text password
 * @return {string} The hashed password
 */
const getHashedPassword = (password) => {
    // Password will be saved as a hash and login will be verified by comparing hashed passwords.
    return bcrypt.hashSync(password, 10); //Can possibly use hash async with an await?
}

/**
 * Creates a user given an email and a password.
 * Optionally this user can be an admin.
 * @param {*} db The connection to the database
 * @param {string} email The email that uniquely identifies this user
 * @param {string} plainTextPassword The clear-text password
 * @param {boolean} isAdmin (Optional) Whether or not this user is an admin [Default: false]
 * @return {boolean} Whether or not a user was inserted
 * @throws {errors.ValidationError} In case a user already exists
 */
const create = async (db, email, plainTextPassword, firstName, surname, isAdmin) => {
    // Save a new user to the database
    // Using email as identifier so ensure it doesn't exist before saving - to do

    const exists = await userExists(db, email);
    if (!exists) {
        await db.collection('users').insertOne({
            email: email,
            password: getHashedPassword(plainTextPassword),
            firstName: firstName,
            surname: surname,
            isAdmin: isAdmin || false,
            isActive: true
        });
        return true
    } else {
        throw new errors.ValidationError("User already exists");
    }
}

/**
 * Checks if a user exists by searching the user collection for an entry with that email
 * @param {*} db The connection to the database
 * @param {string} email The email that uniquely identifies this user
 * @return {boolean} Whether or not a user exists
 */
const userExists = async (db, email) => {
    try {
        await fetchByEmail(db, email);
        return true;
    } catch (e) {
        if (e instanceof errors.UserNotFoundError) {
            return false;
        }
    }
}

/**
 * Lists all registered users in the database
 * @param {*} db The connection to the database
 * @return {Array} An array of users
 */
const list = async (db) => {
    return fetch(db, {});
};

/**
 * Check the login against the database
 * @param {*} db The connection to the database
 * @param {string} email The email that uniquely identifies this user
 * @param {string} password Clear-text password
 * @return {boolean} true if credentials are valid, exception otherwise
 */
const checkLogin = async (db, email, password) => {
    // Check user creds against the database
    const user = await fetchByEmail(db, email, true);
    if(bcrypt.compareSync(password, user.password)) {//Can possibly use compare async with an await?
        return true
    } else {
        throw new errors.InvalidCredentialsError()
    }
}
module.exports = {
    fetch,
    fetchUser,
    fetchById,
    fetchByEmail,
    list,
    create,
    userExists,
    checkLogin
};
