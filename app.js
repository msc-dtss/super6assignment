const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const logger = require('morgan');
const routesAutoLoader = require('./routes/autoloader');
const dbOps = require('./super6db/db-operations');
const viewAutoInjectData = require('./routes/helpers/view-auto-inject');
const authorisationLayer = require('./routes/helpers/authorisation');

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

dbOps.initialize(app, "localhost", 27017);

module.exports = app;
