const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const resultsService = require('../services/results');

/**
 * Initializes a MongoDB client connection to the given host and port.
 * Available across the system with req.app.get('super6db').
 * Seeds the database in dev mode or if `SUPERSIX_FORCE_SEED` environment variable is set to `"true"`
 * @param {*} app The express application to bind the database connecion to.
 * @param {string} host IP or domain name of the database host.
 * @param {number} port Port that MongoDB is listening on
 * @emits db-ready Once the connection is established and the database has been (optionally) seeded
 */
const initialize = (app, host, port) => {
    MongoClient.connect(`mongodb://${host}:${port}`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        async (err, client) => {
            const db = client.db('super6db');
            app.set('super6db', db);
            if (app.get('isDevelopment') || process.env.SUPERSIX_FORCE_SEED === "true") {
                await reSeedDatabase(db);
            }
            app.emit('db-ready');
            resultsService.refreshResults(db);
        }
    );
}

/**
 * Checks if a collection exists in the database or not
 * @param {*} db The database connection
 * @param {*} collection The database collection name we're looking for
 * @returns {boolean} `true` if the collection exists in the database
 */
const hasCollection = async (db, collection) => {
    try {
        const collections = await db.collections()
        return collections.map(c => c.collectionName).includes(collection);
    }
    catch (e) {
        return false;
    }
}

/**
 * Seeds the database with the contents of ./super6db .json files.
 * This will overwrite any DB changes you have, however it respects any comma separated collection names in `SUPERSIX_NO_OVERWRITE` environment variable.
 * Be default, `.vscode/launch.json` injects the following to the environment variables: `SUPERSIX_NO_OVERWRITE=users,bets`
 * @param {*} db The connection to the database
 */
const reSeedDatabase = async (db) => {
    const files = fs.readdirSync('./super6db');
    for(let f=0; f<files.length; f++){
        const file = files[f];
        if (file.endsWith(".json")) {
            const collection = file.split('.').slice(0, -1).join('.');
            const doNotTouch = (process.env.SUPERSIX_NO_OVERWRITE || "")
                .split(',')
                .map((item) => {
                    return item.trim();
                })
            const collectionExists = await hasCollection(db, collection);
            if (!doNotTouch.includes(collection) || !collectionExists) {
                console.info(`Seeding ${collection}`);
                const data = require(`../super6db/${collection}`);
                if (collectionExists) {
                    await db.dropCollection(collection);
                }
                try {
                    await db.collection(collection).insertMany(data);
                } catch (e) {
                    console.error(`Unable to insert into ${collection}`, e);
                }
            } else {
                console.info(`Ignoring ${collection}`);
            }
        }
    };
};

module.exports = {
    initialize
}