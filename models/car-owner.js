var mongoose = require('mongose');

var carOwnerSchema = new mongoose.Schema({
    userId: { type: Number, unique: true },
    location: { type: String }
});

module.exports = mongoose.module('CarOwner', carOwnerSchema);
