const express = require('express')
const router = express.Router()
const request = require('request')
var MongoClient = require('mongodb').MongoClient
const app = express();

//Database object
var dbo;

//Loading First Parking Homepage
router.get('/', function(req, res, next) {
    res.sendFile('index.html');
})

//Mongodb connection
MongoClient.connect('mongodb://127.0.0.1:8000/firstparking', function(err, db) {
    if (err) {
        console.dir(err)
    }
    dbo = db;
});

/*
The mapbox access api way
//https://api.mapbox.com/{endpoint}?access_token={your_access_token}
*/

//Route for getting near by parking slots
Router.get('/getParkData', function(req, res) {
    var getDataRecurssive = new getDataRecurssive(req.query.latitude, req.query.longitude, req.query.radius, res);
    getDataRecurssive.getData();
});


//Route for checking availability of a parking slot
Router.get('/checkAvailability', function(req, res) {
    var placeId = {
        status: "ok",
        "placeId": req.query.placeId
    };
    var availCollection = dbo.collection('availability');
    availCollection.findOne({
        placeId: req.query.placeId
    }, function(err, item) {
        if (item) placeId.item = item;
        else placeId.status = "Not available";
        res.send(placeId);
    });
});

//Route for fetching all objects from availability collection
router.get("/getAllAvailability", function(req, res) {
    var availCollection = dbo.collection('availability');
    availCollection.find().toArray(function(err, result) {
        res.send(result);
    });
});


app.get('/', (req, res) => {
    res.send('First Parking App!')
});

app.listen(8000, () => {
    console.log('First Parking listening on port 8000!')
});