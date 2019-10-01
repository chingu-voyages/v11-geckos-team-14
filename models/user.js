 var mongoose = require('mongoose');

 var UserSchema = new mongoose.Schema({
     username: { type: String, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true },
     telephone: { type: String, required: true },
     email: { type: String, unique: true, required: [true, "email can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
     hash: { type: String, required: true },
     Parkinglocation: { type: String, required: true },
 }, { timestamps: true });

 mongoose.model('User', UserSchema)

 module.exports = mongoose.model('User', UserSchema);
