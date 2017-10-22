let mongoose = require('mongoose');

var BranchSchema = mongoose.Schema({
    branchName: {
        type: String,
        unique:true
    },
    subjects: {
        type: Array
    }
});

let entry= module.exports= mongoose.model('branch',BranchSchema)

module.exports.insertBranch=function(newEntry,callback){
    newEntry.save(callback)
}

module.exports.findAndUpdate = function (branchName,subject, callback) {
    entry.findOneAndUpdate({ branchName: branchName }, { $set: { "subjects": subject } }, callback)
}