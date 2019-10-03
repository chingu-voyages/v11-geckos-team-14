var mongoose = require('mongoose');


var serviceproviderSchema = new mongoose.Schema({
    userId: { type: Number, unique: true },
    parklocation: { type: String }
});

module.exports = mongoose.model('ServiceProvider', serviceproviderSchema);
