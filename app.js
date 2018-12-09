var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var flash = require('connect-flash');
var session = require("express-session");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
require('dotenv').config();
var app = express();

/* Session configuration */
var sessionConfig = {
    secret: 'play hard',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 600000 }
    //store : new MongoStore({url: mongoDBStore})
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Use the session middleware
app.use(session(sessionConfig));

/* Passport */
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next){
    res.locals.isAuthenticated = req.isAuthenticated();
    console.log("AUTH:" +res.locals.isAuthenticated );
    res.locals.session = req.session;
    if(res.locals.isAuthenticated === false){
        //console.log(next);
        //res.redirect('/');
    }
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
