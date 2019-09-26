var express = require('express')
var router = express.Router()
var chalk = require('chalk')
var request = require('request')
var MongoClient = require('mongodb').MongoClient
var app = express();

//Mongo connection
var dbo;
var url = "mongodb://localhost:27017/fpdb";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database created")
    db.close();
});

//Loading First Parking Homepage
router.get('/', function(req, res, next) {
    res.sendFile('index.html');
})

/*
The mapbox access api way
//https://api.mapbox.com/{endpoint}?access_token={your_access_token}
*/

//Route for getting near by parking slots
router.get('/getParkData', function(req, res) {
    var getDataRecurssive = new getDataRecurssive(req.query.latitude, req.query.longitude, req.query.radius, res);
    getDataRecurssive.getData();
});


//Route for checking availability of a parking slot
router.get('/checkAvailability', function(req, res) {
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

/*
 Route for inserting parking slot status for a particular placeID
 Query Param: parks - string separated by ',' ,which defines the name of the slot
 */
router.get("/insertParkers", function(req, res) {
    var availCollection = dbo.collection('availability');
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


/*
 Route for adding parking spot - custom parking lot creation
 Query Param: latitude
 Query Param: longitude
 Query Param: name
 Query Param: address
 */
router.get("/addPlaceToMap", function(req, res) {
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
router.get("/getAllAvailability", function(req, res) {
    var availCollection = dbo.collection('availability');
    availCollection.find().toArray(function(err, result) {
        res.send(result);
    });
});

//Route for removing all objects from availability collection
router.get("/removePlace", function(req, res) {
    var availCollection = dbo.collection('availability');
    availCollection.remove({ placeId: req.query.placeId });
    res.send("done");
});

app.get('/', (req, res) => {
    res.send('First Parking App!')
});

module.exports = router;
