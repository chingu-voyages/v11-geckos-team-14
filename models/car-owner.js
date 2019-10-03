var mongoose = require('mongoose');

var carOwnerSchema = new mongoose.Schema({
    userId: { type: Number, unique: true },
    location: { type: String }
});

module.exports = mongoose.model('CarOwner', carOwnerSchema);
