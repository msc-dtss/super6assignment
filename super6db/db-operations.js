const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const resultsService = require('../services/results');
const errors = require('../errors/super6exceptions');

/**
 * Creates a MongoDB connection string from the given parameters.
 * @param {String} host IP or domain name of the database host.
 * @param {Number} port Port that MongoDB is listening on
 * @param {String} username Username to connect to MongoDB
 * @param {String} password Password to connect to MongoDB
 * @param {String} database Database name to connect to MongoDB
 */
const toMongoDBString = (host, port, username, password, database) => {
    if (!host || !port) {
        throw new errors.ValidationError("No host or port provided.");
    }
    const db = !database ? '' :  `/${database}`;
    return !!username && !!password ? `mongodb://${username}:${password}@${host}:${port}${db}` : `mongodb://${host}:${port}`;
}

/**
 * @see initializeWithURL
 * @param {*} app The express application to bind the database connecion to.
 * @param {String} host IP or domain name of the database host.
 * @param {Number} port Port that MongoDB is listening on
 * @param {String} username Username to connect to MongoDB
 * @param {String} password Password to connect to MongoDB
 * @param {String} database Database name to connect to MongoDB
 * @emits db-ready (via call to `initializeWithURL`) Once the connection is established and the database has been (optionally) seeded
 */
const initialize = (app, host, port, username, password, database) => {
    initializeWithURL(app,
        toMongoDBString(host, port, username, password, database),
        database);
};


/**
 * Initializes a MongoDB client connection to the given host and port.
 * Available across the system with req.app.get('super6db').
 * Seeds the database in dev mode or if `SUPERSIX_FORCE_SEED` environment variable is set to `"true"`
 * @param {*} app The express application to bind the database connecion to.
 * @param {String} url The MongoDB connection string
 * @param {String} database Database name to connect to MongoDB
 * @emits db-ready Once the connection is established and the database has been (optionally) seeded
 */
const initializeWithURL = (app, url, database) => {
    MongoClient.connect(url,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        async (err, client) => {
            if (err) {
                console.error(err);
            }
            const db = client.db(database || 'super6db');
            app.set('super6db', db);
            if (app.get('isDevelopment') || process.env.SUPERSIX_FORCE_SEED === "true") {
                await reSeedDatabase(db);
            }
            app.emit('db-ready');
            resultsService.refreshResults(db);
        }
    );
};

/**
 * Checks if a collection exists in the database or not
 * @param {*} db The database connection
 * @param {*} collection The database collection name we're looking for
 * @returns {Boolean} `true` if the collection exists in the database
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
    for (let f = 0; f < files.length; f++) {
        const file = files[f];
        if (file.endsWith(".json")) {
            const collection = file.split('.').slice(0, -1).join('.');
            const doNotTouch = (process.env.SUPERSIX_NO_OVERWRITE || "")
                .split(',')
                .map((item) => {
                    return item.trim();
                })
            const collectionExists = await hasCollection(db, collection);
            if (!collectionExists) {
                console.info(`Seeding ${collection}`);
                const data = require(`../super6db/${collection}`);
                try {
                    const inserted = await db.collection(collection).insertMany(data)
                    console.log(`  Seeded ${collection}: `, inserted.result.ok === 1);
                } catch (e) {
                    console.error(`  Unable to insert into ${collection}:`, e);
                }
            } else {
                if (!doNotTouch.includes(collection) && (process.env.SUPERSIX_NO_OVERWRITE || !['bets', 'users'].includes(collection))) {
                    console.info(`Seeding ${collection}`);
                    const data = require(`../super6db/${collection}`);
                    if (collectionExists) {
                        try {
                            console.info(`  Dropped ${collection}:`, await db.dropCollection(collection));
                        } catch (ignore) {
                            console.info(`  Problem while dropping ${collection}`, ignore)
                        }
                    }
                    try {
                        const inserted = await db.collection(collection).insertMany(data)
                        console.log(`  Seeded ${collection}: `, inserted.result.ok === 1);
                    } catch (e) {
                        console.error(`  Unable to insert into ${collection}:`, e);
                    }
                } else {
                    console.info(`Ignoring ${collection}`);
                }
            }
        }
    };
};

module.exports = {
    initialize,
    initializeWithURL,
    _toMongoDBString: toMongoDBString
}