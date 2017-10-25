let mongoose = require('mongoose');

let InternalAllotmentSchema = mongoose.Schema({
    college_code: {
        type: String
    },
    subject: {
        type: String
    },
    facultyName: {
        type: String
    },
    pemail: {
        type: String
    }
});

let ExternalSchema = mongoose.Schema({
    college_code: {
        type: String
    },
    subject: {
        type: String
    },
    facultyName: {
        type: String
    },
    pemail: {
        type: String
    }
})


let internal = module.exports.internal = mongoose.model('internalAllottment', InternalAllotmentSchema)

module.exports.internalSubjects = function (code, callback) {
    internal.find({
        college_code: code
    }, callback)
}