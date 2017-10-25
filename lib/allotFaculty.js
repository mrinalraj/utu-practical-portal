const models = require('../model/models'),
    mongoose = require('mongoose');


function getSubjects(callback) {
    let subjects = new Array,
        allottedSubject = []
    models.createBranch.find({}, (err, branches) => {
        branches.forEach(function (element, i) {
            models.facultyAllotment.find({}, (err, list) => {
                list.forEach(function (subs) {
                    allottedSubject.push(subs)
                })
            })
            //console.log(allottedSubject)
            subjects = subjects.concat(element.subjects)
        })
        callback(null, subjects)
    })

}

function getFaculties(callback) {
    models.faculty.find({}, (err, faculties) => {
        callback(faculties)
    })
}

Array.prototype.contains = function (element) {
    return this.indexOf(element) > -1;
}

module.exports.internalExamner = function () {
    let collegeName = []
    models.dean.distinct('college_code', (err, colleges) => {
        colleges.forEach(function (element, i) {
            getFaculties(function (faculties) {
                faculties.forEach(function(fac){
                    console.log(fac.full_name)
                    getSubjects(function(err,subjects){
                        console.log(subjects)
                    })
                })
            })
        })
    })
}
module.exports.addColleges = function () {
    models.dean.distinct('college_code', (err, colleges) => {
        if (!err && colleges) {
            models.createBranch.find({}, (err, branches) => {
                let subjects = [];
                branches.forEach(function (element) {
                    subjects = subjects.concat(element.subjects)
                });
                models.faculty.find({}, (err, result) => {
                    console.log(result)
                })

            })
        }
    })
}