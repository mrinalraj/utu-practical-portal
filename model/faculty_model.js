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
    designation: {
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
    experience: {
        type: String
    },
    password: {
        type: String
    },
    verified1: {
        type: Boolean
    },
    verified2: {
        type: Boolean
    },
    subject: {
        type: Array
    }
});

var user = module.exports = mongoose.model('faculty', HODSchema);

module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
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

module.exports.findAllUnverifiedFirst = function (branch, code, callback) {
    user.find({
        'college_code': code,
        'branch': branch,
        'verified1': false
    }, callback);
}
module.exports.findAllUnverifiedSecond = function (code, callback) {
    user.find({
        'college_code': code,
        'verified1': true,
        'verified2': false
    }, callback);
}

module.exports.findAndVerifyOne = function (username, callback) {
    user.findOneAndUpdate({
        pemail: username
    }, {
        $set: {
            "verified1": true
        }
    }, callback)
}
module.exports.findAndVerifyTwo = function (username, callback) {
    user.findOneAndUpdate({
        pemail: username
    }, {
        $set: {
            "verified2": true
        }
    }, callback)
}

module.exports.addOrUpdateSubjects = function (username, subjects, callback) {
    user.findOne({
        pemail: username
    }, (err, user1) => {
        if (user1) {
            let entry=subjects.concat(user1.subject)
            user.findOneAndUpdate({
                pemail: username
            }, {
                $set: {
                    "subject": entry
                }
            }, callback)
        }
    })
}

module.exports.editProfile = function (username, data, callback) {
    user.findOneAndUpdate({
        pemail: username
    }, {
            $set: {
                full_name: data.full_name,
                college_name: data.college_name,
                college_code: data.college_code,
                phone: data.phone,
                designation: data.designation,
                oemail: data.oemail,
                pemail: data.pemail
            }
        }, callback)
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}