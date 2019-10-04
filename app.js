const express = require('express');
const path = require('path');
const chalk = require('chalk');
const mongo = require('mongodb');
const routes = require('./routes/index');
const user = require('./models/user');
const carowner = require('./models/car-owner');
const serviceprovider = require('./models/service-provider');
const userprofile = require('./models/user-profile');
const MongoClient = require('mongodb').MongoClient
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/views'));
//app.use(user);

//route configuration
app.use('/', routes);

//listening for the port
app.listen(8000, function() {
    console.log(`Listening on port" ${chalk.green('8000')}`)
})

// catch 404 and forward to error handler
app.use(function(req, res) {
    res.status(404).send('Not Found Error');
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
