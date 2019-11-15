const createError = require('http-errors');
const fs = require('fs');
const express = require('express');
const path = require('path');
const session = require('express-session');
const logger = require('morgan');
const routesAutoLoader = require('./routes/autoloader');
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.set('isDevelopment', app.get('env') === 'development');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public"))); // use express-session to track user across session
app.use(
    session({
        key: "sid",
        secret: "verySecretStuff", //userService.getNewToken, //from users Service?
        resave: false,
        saveUninitialized: false
    })
);

//middleware to expose logged in name
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// Load all the routes inside ./routes/
routesAutoLoader.load(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// MongoDB client connecting to default port and db name of super6db.
// Available across the system with req.app.get('super6db')
MongoClient.connect('mongodb://localhost:27017',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    async (err, client) => {
        const db = client.db('super6db');
        app.set('super6db', db);
        if(app.get('isDevelopment')){
            await reSeedDatabase('./super6db', db);
        }
        app.emit('db-ready')
    }
);


const reSeedDatabase = async (jsonDir, db) => {
    // Add required data to db when it does not exist
    // usersModule.createUser(
    //     app.get("super6db"),
    //     "admin@super6.com",
    //     "password",
    //     true,
    //     () => { }
    // );
    const files = fs.readdirSync(jsonDir);
    files.forEach(async (file) => {
        if (file.endsWith(".json")) {
            const collection = file.split('.').slice(0, -1).join('.');
            const data = require(`${jsonDir}/${collection}`);
            try{
                await db.dropCollection(collection);
            } catch(ignored) {
                //don't really care
            }
            try{
                await db.collection(collection).insertMany(data);
            } catch(e) {
                console.error(`Unable to insert into ${collection}`, e)
            }
        }
    });
};

module.exports = app;
