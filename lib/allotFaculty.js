const models = require('../model/models'),
    mongoose = require('mongoose'),
    forEachAsynch= require('forEachAsync');

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
            console.log(err, result)
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


let saveInternal = function (clgcode, subject, name, email) {
    return new Promise(function (resolve, reject) {
        let entry = new models.facultyAllotment.internal({
            college_code: clgcode,
            subject: subject,
            facultyName: name,
            pemail: email
        })

        entry.save((err, result) => {
            if (err) return reject(err)
            return resolve(result)
        })
    })
}



module.exports.internalExaminer =async function () {
    models.dean.distinct('college_code', (err, colleges) => {
        colleges.forEach(function (element, i) {
            getFaculties(element)
                .then(function (faculties) {
                    faculties.forEach(function (faculty) {
                        let counter = 0,
                            counterMax = 2;
                        getUnallotedSubjects(element).then(function (subjects) {
                            subjects.forEach(function (subject, i) {
                                if (faculty.subject.contains(subject) && counter <= counterMax) {
                                    let entry = new models.facultyAllotment.internal({
                                        college_code: element,
                                        subject: subject,
                                        facultyName: faculty.full_name,
                                        pemail: faculty.pemail
                                    })
                                    let promise = entry.save();
                                    promise.then(function(result){
                                        counter++;
                                    })
                                    // saveInternal(element, subject, faculty.full_name, faculty.pemail).then(function (result) {
                                    //     counter++;
                                    // })
                                }
                            })

                        })
                    })
                })
                .catch(function (fromReject) {
                    console.log('err occured ' + fromReject.errMsg)
                })
        })
    })
}


module.exports.externalExaminer = function () {
    model.dean.distinct('college_code',(err,colleges)=>{
        colleges.forEach(function (faculty,index){})
    })
}