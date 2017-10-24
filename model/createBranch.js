let mongoose = require('mongoose');

var BranchSchema = mongoose.Schema({
    branchName: {
        type: String,
        unique: true
    },
    subjects: {
        type: Array
    },
    dates: {
        type: Array
    }
});

let entry = module.exports = mongoose.model('branch', BranchSchema)

module.exports.insertBranch = function (newEntry, callback) {
    newEntry.save(callback)
}

module.exports.findAndUpdate = function (branchName, subject, dates, callback) {
    entry.findOne({
        branchName: branchName
    }, (err, data) => {
        if (data) {
            let entry1 = subject.concat(data.subjects),
                entry2 = dates.concat(data.dates)
            entry.findOneAndUpdate({
                branchName: branchName
            }, {
                $set: {
                    "subjects": entry1,
                    "dates": entry2
                }
            }, callback)
        }
    })
}