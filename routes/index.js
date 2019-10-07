const express = require('express');
const chalk = require('chalk');
const request = require('request');
const MongoClient = require('mongodb').MongoClient
const router = express.Router();
const MapboxClient = require('mapbox');
const app = express();

app.use(express.urlencoded());

//Mongo connection
const uri = "mongodb+srv://user1:user1@cluster0-pxjbp.mongodb.net/admin?retryWrites=true&w=majority";

MongoClient.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, client) {
    if (err) {
        console.log('An error occurred connecting to MongoDB: ', err)
    } else {
        const db = client.db('firstparking');
        db.collection('users', function(err, collection) {
            collection.find().toArray(function(err, res) {
                if (err) return err;
                return res;
            })
        })
    }
    client.close();
})

//Loading First Parking Homepage
router.get('/', function(req, res, next) {
    res.sendFile('index.html');
});

//The MapBox API access
const client = new MapboxClient('pk.eyJ1Ijoic2FtdWVsb2tlbGxvZ3VtIiwiYSI6ImNqemZnYXVzejAyMDQzZ280NGo0aDBsbzgifQ.n3aTh1uXQs8gczGexkbTKA');
client.geocodeForward('')
    .then(function(res) { // res is the http response, including: status, headers and entity properties
        var data = res.entity; // data is the geocoding result as parsed JSON
    })
    .catch(err => {
        console.log(err)
    });

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
