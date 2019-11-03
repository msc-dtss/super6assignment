const createError = require("http-errors");
const express = require("express");
const path = require("path");
const session = require("express-session");
const logger = require("morgan");
const routesAutoLoader = require("./routes/autoloader");
const userService = require("./services/users");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
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

// Load all the routes inside ./routes/
routesAutoLoader.load(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.set("isDevelopment", app.get("env") === "development");

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// MongoDB client connecting to default port and db name of super6db.
// Available across the system with req.app.get('super6db')
const MongoClient = require("mongodb").MongoClient;
MongoClient.connect(
  "mongodb://localhost:27017",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  function(err, client) {
    app.set("super6db", client.db("super6db"));
    //startUpDataChecks(); - not yet enabled
  }
);

const startUpDataChecks = () => {
  // Add required data to db when it does not exist
  usersModule.createUser(
    app.get("super6db"),
    "admin@super6.com",
    "password",
    true,
    function() {}
  );
};

module.exports = app;
