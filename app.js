const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const logger = require('morgan');

const config = require('./config/config.json');
const routesAutoLoader = require('./routes/autoloader');
const dbOps = require('./super6db/db-operations');
const viewAutoInjectData = require('./routes/helpers/view-auto-inject');
const authorisationLayer = require('./routes/helpers/authorisation');
const resultsRefresher = require('./workers/resultsRefresher');
const resultsService = require('./services/results');

const app = express();
app.set('isDevelopment', app.get('env') === 'development');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
    session({
        key: "sid",
        secret: "verySecretStuff",
        resave: false,
        saveUninitialized: false
    })
);

app.use(viewAutoInjectData);

app.use(authorisationLayer.verify);

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
    res.locals.error = err;
    const status = err.status || err.httpCode || 500;
    err.httpCode = status;
    // render the error page
    res.status(status);
    res.render('error', {
        title: `${status} ${err.message}`
    });
});

if (!process.env.MONGODB_URI) {
    dbOps.initialize(app,
        config.database.host,
        config.database.port,
        config.database.username,
        config.database.password,
        config.database.database);
} else {
    dbOps.initializeWithURL(app, process.env.MONGODB_URI, process.env.MONGODB_DB_NAME)
}

//Start a worker to refresh the results cache.
app.on('db-ready', () => {
    // Every 5 minutes
    resultsRefresher.setup(60*5,
        (results) => {
            console.log("Data is refreshed");
            resultsService.refreshCacheResults(app.get('super6db'), results);
        },
        (error) => {
            console.error(error);
        }
    );
});
module.exports = app;
