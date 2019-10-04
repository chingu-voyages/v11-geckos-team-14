const express = require('express');
const chalk = require('chalk');
const request = require('request');
const MongoClient = require('mongodb').MongoClient
const router = express.Router();
const app = express();

//Mongo connection
const uri = "mongodb+srv://user1:<user1>@cluster0-pxjbp.mongodb.net/admin?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
client.connect(err => {
    const collection = client.db("firstparking").collection("users");
    // perform actions on the collection object
    if (err) {
        console.log("Database conncetion failed!")
    } else {
        console.log("Database connection successful!")
    }
    client.close();
});

//Loading First Parking Homepage
router.get('/', function(req, res, next) {
    res.sendFile('index.html');
});

app.get('/', function(req, res) {
    if (req !== null) {
        res.send('index.html');
    }
});


/*
The mapbox access api way
//https://api.mapbox.com/{endpoint}?access_token={your_access_token}
*/

//Route for getting near by parking slots
router.get('/getParkingSlotData', function(req, res) {
    var getDataRecurssive = new getDataRecurssive(req.query.latitude, req.query.longitude, req.query.radius, res);
    getDataRecurssive.getData();
});

//Route for checking availability of a parking slot
router.get('/checkParkingSlots', function(req, res) {
    var placeId = {
        status: "ok",
        "placeId": req.query.placeId
    };
    var availCollection = client.db("firstparking").collection("location");
    availCollection.findOne({
        placeId: req.query.placeId
    }, function(err, item) {
        if (item) placeId.item = item;
        else placeId.status = "Not available";
        res.send(placeId);
    });
});


//Route for adding parking slot status for a particular placeID
router.get("/addParkingSlots", function(req, res) {
    var availCollection = client.db('firstparking').collection('location');
    var parks = req.query.parks.split(",");
    var pStatus = req.query.pStatus.split(",");
    var pMap = {
        parkmap: {}
    };
    for (var i = 0; i < parks.length; i++) {
        pMap.parkmap[parks[i]] = pStatus[i];
    }
    pMap = flattenObject(pMap);
    availCollection.update({
        placeId: req.query.placeId
    }, {
        $set: pMap
    });
    res.send("Update fired : " + req.query.placeId);
});


//Route for adding parking spot - custom parking lot creation
router.get("/addLocations", function(req, res) {
    var requestUrl = '';
    var type = "parking";
    if (req.query.type) {
        type = req.query.type;
    }
    var newData = {
        "location": {
            "lat": parseFloat(req.query.latitude),
            "lng": parseFloat(req.query.longitude)
        },
        "accuracy": 50,
        "name": req.query.name,
        "address": req.query.address,
        "types": [type]
    };
    var options = {
        host: 'maps.mapbox.com',
        uri: requestUrl,
        method: 'POST',
        json: newData
    };
    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(newData);
            console.log(typeof(body));
            if (body.status == 'OK') {
                res.send("Added " + req.query.name + "\n PlaceID :" + body.place_id);;
            } else {
                res.send(" Failed..!!! ");
            }
        }
    });
});

//Route for fetching all objects from availability collection
router.get("/getAllLocations", function(req, res) {
    var availCollection = client.db('firstparking').collection('location');
    availCollection.find().toArray(function(err, result) {
        res.send(result);
    });
});

//Route for removing all objects from availability collection
router.get("/removeLocations", function(req, res) {
    var availCollection = client.db('firstparking').collection('location');
    availCollection.remove({ placeId: req.query.placeId });
    res.send("done");
});


module.exports = router;
