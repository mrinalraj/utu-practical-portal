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
    college_code_from: {
        type : String
    },
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
let external = module.exports.external = mongoose.model('externalAllottment', ExternalSchema)


module.exports.internalSubjects = function (code, callback) {
    internal.find({
        college_code: code
    }, callback)
}

module.exports.externalSubjects = function (code, callback) {
    external.find({
        college_code: code
    }, callback)
}