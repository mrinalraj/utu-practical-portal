let mongoose = require('mongoose');

var InternalAllotmentSchema = mongoose.Schema({
    subject: {
        type: String,
        unique: true
    },
    facultyName: {
        type: String
    },
    pemail: {
        type: String
    }
});

let internal = module.exports = mongoose.model('internalAllottment', InternalAllotmentSchema)

module.exports.allot = function (newEntry, callback) {
    newEntry.save(callback)
}

