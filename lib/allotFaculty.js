const models = require('../model/models'),
    mongoose = require('mongoose'),
    library = require('./googleMatrix')
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
            let subjects = result.map(each => each.subject)
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
                        fromResolve.splice(fromResolve.indexOf(element), 1)
                    }
                })
                return resolve(fromResolve)
            })
        })
    })
}


let getAllotedSubjectsExternal = function (college_code) {
    return new Promise(function (resolve, reject) {
        models.facultyAllotment.externalSubjects(college_code, (err, result) => {
            if (err) return reject(err)
            let subjects = result.map(each => each.subject)
            return resolve(subjects)
        })
    })
}

let getUnallotedSubjectsExternal = function (college_code) {
    return new Promise(function (resolve, reject) {
        getAllSubjects().then(function (fromResolve) {
            getAllotedSubjectsExternal(college_code).then(function (subs) {
                subs.forEach(function (element, index) {
                    if (fromResolve.contains(element)) {
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

let assignInt = function (college) {
    getFaculties(college)
        .then(function (faculties) {
            forEachAsync(faculties, function (next, faculty) {
                setTimeout(function () {
                    let counter = 0,
                        counterMax = 1;
                    if (counter <= counterMax) {
                        getUnallotedSubjects(college).then(function (subjects) {
                            subjects.forEach(function (subject, i) {
                                if (faculty.subject.contains(subject)) {
                                    let entry = new models.facultyAllotment.internal({
                                        college_code: college,
                                        subject: subject,
                                        facultyName: faculty.full_name,
                                        pemail: faculty.pemail
                                    })
                                    entry.save((err, result) => {
                                        if (!err && result) {
                                            counter++
                                        };
                                    });
                                }
                            })
                        })
                    }
                    next()
                }, 1000)
            })
        })
        .catch(function (fromReject) {
            console.log('err occured ' + fromReject.errMsg)
        })
}

let assignExt = function (origin, dest) {
    getFaculties(origin)
        .then(function (faculties) {
            forEachAsync(faculties, function (next, faculty) {
                setTimeout(function () {
                    let counter = 0,
                        counterMax = 1;
                    getUnallotedSubjectsExternal(dest).then(function (subjects) {
                        console.log(subjects)
                        subjects.forEach(function (subject, i) {
                            if (faculty.subject.contains(subject) && counter <= counterMax) {
                                let entry = new models.facultyAllotment.external({
                                    college_code_from: origin,
                                    college_code: dest,
                                    subject: subject,
                                    facultyName: faculty.full_name,
                                    pemail: faculty.pemail
                                })
                                entry.save((err, result) => {
                                    if (!err && result) {
                                        counter++
                                    };
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
}

module.exports.internalExaminer = async function () {
    models.dean.distinct('college_code', (err, colleges) => {
        colleges.forEach(function (element, i) {
            assignInt(element)
        })
    })
}

let getDestination = function (origin) {
    return new Promise(function (resolve, reject) {
        let destination = []
        models.dean.find({
            college_name: {
                $ne: origin
            }
        }, (err, data) => {
            if (err) return reject(err.messsage)
            for (let obj of data) {
                destination.push(obj.college_name)
            }
            return resolve(destination)
        })
    })
}

let getCollegeCode = function (collegeName) {
    return new Promise((resolve, reject) => {
        models.dean.find({
            college_name: collegeName
        }, (err, data) => {
            if (err) return reject(err)
            return resolve(data[0].college_code)
        })
    })
}


module.exports.externalExaminer = function () {
    models.dean.distinct('college_code', (err, colleges) => {
        models.dean.distinct('college_name', (err, collegeNames) => {
            colleges.forEach((college, i) => {
                let origin = collegeNames[i]
                getDestination(origin).then(fromResolve => {
                    library.distance({
                        origin: origin,
                        destinations: fromResolve
                    }, (err, data) => {
                        if (err) return err.messsage;
                        let distanceArray = data.map(each => each.distanceValue)
                        let collegeTo = fromResolve[distanceArray.indexOf(Math.min.apply(null, distanceArray))]
                        getCollegeCode(collegeTo)
                            .then(function (code) {
                                assignExt(college, code)
                            })
                    })
                })
            })
        })
    })
}