var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var HODSchema = mongoose.Schema({
    college_name: {
        type: String
    },
    college_code: {
        type: String
    },
    full_name: {
        type: String,
    },
    branch: {
        type: String
    },
    phone: {
        type: String
    },
    pemail: {
        type: String,
        index: true,
        unique: true
    },
    oemail: {
        type: String,
        index: true
    },
    date_of_joining: {
        type: String
    },
    experience: {
        type: String
    },
    password: {
        type: String
    },
    verified: {
        type: Boolean
    }
});

var user = module.exports = mongoose.model('hod', HODSchema);

module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.findAllUnverified = function (code, callback) {
    user.find({
        'college_code': code,
        'verified': false
    }, callback);
}

module.exports.findAndVerify = function (username, callback) {
    user.findOneAndUpdate({
        pemail: username
    }, {
        $set: {
            "verified": true
        }
    }, callback)
}

module.exports.getUserByUsername = function (username, callback) {
    var query = {
        pemail: username
    };
    user.findOne(query, callback);
}

module.exports.getUserById = function (id, callback) {
    user.findById(id, callback);
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}