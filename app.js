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
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', require('./routes/index'))
app.use('/users', require('./models/user'))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/views'));

//Load Index Page
app.get('/', function(req, res) {
    res.sendFile('index.html');

});

//Sign In
app.post('sign-in', function(req, res) {
    var email = req.body.email
    var password = req.body.password
    console.log(email)
    res.end("Yes");
});

//Sign Up
app.post('sign-up', function(req, res) {
    user.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const newUser = new User({
                username: req.body.username,
                telephone: req.body.telephone,
                email: req.body.email,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => { console.log(err) })
                });
            });
        }
    });
    res.redirect('/profile.html');
});




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
