const models = require('../model/models'),
    mongoose = require('mongoose'),
    forEachAsync = require('forEachAsync').forEachAsync;

Array.prototype.contains = function (element) {
    return this.indexOf(element) > -1;
}

let getAllSubjects = function () {
    return new Promise(function (resolve, reject) {
        models.createBranch.find({}, (err, branches) => {
            if (err) {
                reject(err)
            } else {
                let subjects = []
                branches.forEach((element, i) => {
                    subjects = subjects.concat(element.subjects)
                })
                resolve(subjects)
            }
        })
    })
}

let getAllotedSubjects = function (college_code) {
    return new Promise(function (resolve, reject) {
        models.facultyAllotment.internalSubjects(college_code, (err, result) => {
            if (err) return reject(err)
            subjects = []
            result.forEach(function (element, i) {
                console.log(element.subject)
                subjects.push(element.subject)
            })
            return resolve(subjects)
        })
    })
}

let getUnallotedSubjects = function (college_code) {
    return new Promise(function (resolve, reject) {
        getAllSubjects().then(function (fromResolve) {
            getAllotedSubjects(college_code).then(function (subs) {
                subs.forEach(function (element, index) {
                    if (fromResolve.contains(element)) {
                        console.log(element)
                        fromResolve.splice(fromResolve.indexOf(element), 1)
                    }
                })
                return resolve(fromResolve)
            })
        })
    })
}

let getFaculties = function (college_code) {
    return new Promise(function (resolve, reject) {
        models.faculty.find({
            college_code: college_code
        }, (err, faculties) => {
            if (err) {
                return reject({
                    err: 1,
                    errMsg: err
                })
            } else {
                return resolve(faculties)
            }
        })
    })
}

module.exports.internalExaminer = async function () {
    models.dean.distinct('college_code', (err, colleges) => {
        colleges.forEach(function (element, i) {
            getFaculties(element)
                .then(function (faculties) {
                    forEachAsync(faculties, function (next, faculty) {
                        setTimeout(function () {
                            let counter = 0,
                                counterMax = 1;
                            getUnallotedSubjects(element).then(function (subjects) {
                                subjects.forEach(function (subject, i) {
                                    if (faculty.subject.contains(subject) && counter <= counterMax) {
                                        let entry = new models.facultyAllotment.internal({
                                            college_code: element,
                                            subject: subject,
                                            facultyName: faculty.full_name,
                                            pemail: faculty.pemail
                                        })
                                        entry.save((err, result) => {
                                            if (!err && result) counter++;
                                        });
                                    }
                                })

                            })
                            next()
                        }, 1000)
                    })
                })
                .catch(function (fromReject) {
                    console.log('err occured ' + fromReject.errMsg)
                })
        })
    })
}

let getCollegeNames = function (college_code, callback) {
    return new Promise(function (resolve, reject) {
        models.dean.distinct('college_code', (err, colleges) => {
            let collegeList = []
            colleges.forEach((college, i) => {
                models.dean.find({
                    college_code: college
                }, (err, result) => {
                    if (err) return reject(err)
                    result.forEach(function(entry,index){
                        collegeList.push(entry.college_name)
                        console.log(collegeList)
                    })
                })
            })
            resolve(collegeList)
        })

    })
}


module.exports.externalExaminer = function () {
    models.dean.distinct('college_code', (err, colleges) => {
        models.dean.distinct('college_name',(err,collegeNames)=>{
            colleges.forEach((college,i)=>{
                
            })
        })
    })
}