const dean = require('../model/dean_model'),
    branch = require('../model/createBranch'),
    models = require('../model/models')


module.exports.addColleges = function () {
    dean.distinct('college_code', (err, colleges) => {
        if (!err && colleges) {
            branch.find({}, (err, branches) => {
                let subjects = [];
                branches.forEach(function (element) {
                    subjects = subjects.concat(element.subjects)
                });
                models.faculty.find({},(err,result)=>{
                    console.log(result)
                })

            })
        }
    })
}