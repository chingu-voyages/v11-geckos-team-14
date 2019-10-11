const express = require('express');
const path = require('path');
const chalk = require('chalk');
const routes = require('./routes/index');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();

app.use('/', routes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/routes', require('./routes/index'));
app.use('/models', require('./models/user'));

//View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/views'));

//Listening for the Port
app.listen(port, () => console.log(`Listening on port" ${chalk.green(port)}`));

//Load Index Page
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

//Sign Up
app.post('sign-up', function(req, res) {
    user.findOne({ email: req.body.email }).then(user => {
        if (user) {
            //return res.status(res.statusCode >= 100 && res.statusCode < 600 ? err.code : 500).json({ email: "Email already exists" });
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const newUser = new User({
                username: req.body.username,
                telephone: req.body.telephone,
                email: req.body.email,
                password: req.body.password
            });

            newUser.db("firstparking").collections("users").insertOne(req.body);

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
    //res.render('/profile.html');
    res.redirect('/profile.html');
});

//Catch 404 and forward to error handler
app.use(function(err, req, res, next) {
    //res.status(res.statusCode >= 100 && res.statusCode < 600 ? err.code : 500).send('Not Found Error');
    if (err) {
        next(err);
    }
    res.status(404).send('Not Found Error');
});

//Development Error Handler printing stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        //res.status(res.statusCode >= 100 && res.statusCode < 600 ? err.code : 500);
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
        if (err) {
            next(err);
        }
    });
}

//Production error handler. No stacktraces
app.use(function(err, req, res, next) {
    //res.status(res.statusCode >= 100 && res.statusCode < 600 ? err.code : 500);
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});

module.exports = app;
