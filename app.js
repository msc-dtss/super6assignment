const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');
const logger = require('morgan');
const routesAutoLoader = require('./routes/autoloader');
const dbOps = require('./super6db/db-operations');

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
        secret: "verySecretStuff",
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

dbOps.initialize(app, "localhost", 27017);

module.exports = app;
