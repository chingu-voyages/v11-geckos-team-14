 var mongoose = require('mongoose');
 var bcrypt = require('bcrypt');

 var BCRYPT_SALT_ROUNDS = 12;

 var UserSchema = new mongoose.Schema({
     username: { type: String, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true },
     telephone: { type: String, required: true },
     email: { type: String, unique: true, required: [true, "email can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
     hash: { type: String, required: true },
     role: { type: Number, required: true, enum: ['Car Owner', 'Park Owner'] }
 }, { timestamps: true });

 UserSchema.statics.authentication = (email, password, callback) => {

     User.findOne({ email: email, password: password }, function(err, user) {
         console.log('calling+', user);
         //bcrypt.compare(password,password, function(err,result){
         if (err || user == null) {
             return callback(err);
         } else {
             return callback(null, user);
         }
         //})
     })



 }
 UserSchema.statics.registration = (userdata, callback) => {
     return User.create({
         username: userdata.username,
         telephone: userdata.telephone,
         email: userdata.email,
         password: bcrypt.hashSync(userdata.password, BCRYPT_SALT_ROUNDS),

     }, function(err, result) {
         if (err) {
             return callback(err);
         } else {
             return callback(null, result);
         }
     });


     /*var ContactModel = mongoose.model('users',UserSchema);
     var contactModel = new ContactModel({
         name:userdata.name,
         email:userdata.email,
         password:userdata.password,
     });
     contactModel.save(); */
 }


 UserSchema.statics.userprofiledata = (userId, callback) => {

     return User.findOne({ _id: userId }).exec(function(err, user) {
         if (err) {
             return callback(err);
         } else if (!user) {
             var err = new Error('User does not exist');
             err.status = 401;
             // return callback(err);
         } else if (user) {
             //console.log('userprofiledata_userId->',user);
             return callback(null, user);
         }
     })
 }

 UserSchema.statics.userprofileupdate = (userdata, callback) => {
     return User.updateOne({ _id: userdata.uid }, {
         username: userdata.username,
         telephone: userdata.telephone,
         email: userdata.email,
         password: userdata.password,

     }, function(err, docs) {
         if (err) return json(err);
         //else    res.redirect('/user/'+req.params.id);
     });
 }

 module.exports = mongoose.model('User', UserSchema);
