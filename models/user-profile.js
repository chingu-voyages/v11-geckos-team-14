var mongoose = require('mongoose');

var UserProfileModel = function(upm) {
    this.email = upm.email,
        this.username = upm.username,
        this.carParkLocation = upm.carParkLocation
};

//module.exports = mongoose.model('UserProfileModel', UserProfileModel);
module.exports = UserProfileModel;
