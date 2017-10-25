let express = require('express'),
    router = express.Router(),
    model = require('../model/models'),
    library = require('../lib/library');

router.get('/', (req, res) => {

    if (req.session.user) {
        return res.redirect('/' + req.session.type + '/dashboard')
    }
    res.render('login', {
        title: 'Dean Academics Login',
        intrested: 'Dean Academics',
        path: '../',
        reg: '/dean/register'
    })

})

router.post('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/' + req.session.type + '/dashboard')
    }
    if (req.body) {
        let username = req.body.email,
            password = req.body.pass;

        model.dean.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                req.flash('error_msg', 'User Not found');
                res.redirect('/dean')
            } else {
                if (user.verified === true) {
                    model.dean.comparePassword(password, user.password, (err, ismatch) => {
                        if (err) throw err;
                        if (ismatch) {
                            req.session.details = {
                                "college_name": user.college_name,
                                "college_code": user.college_code,
                                "full_name": user.full_name,
                                "phone": user.phone,
                                "oemail": user.oemail,
                                "pemail": user.pemail
                            };
                            req.session.user = username
                            req.session.username = user.full_name
                            req.session.type = 'Dean'
                            req.session.code = user.college_code
                            req.flash('success_msg', 'Welcome ' + req.session.username)
                            res.redirect('/dean/dashboard')
                        } else {
                            req.flash('error_msg', 'invalid password')
                            res.redirect('/dean?user=' + username)
                        }
                    })
                } else {
                    req.flash('error_msg', "User Login not verified. Please contact the concerned personnel.")
                    res.redirect('/dean')
                }

            }
        })
    } else {
        res.send('invalid data')
    }
})

router.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/' + req.session.type + '/dashboard')
    }
    res.render('register', {
        title: 'Dean Registration',
        path: '../',
        intrested: 'Dean Academics',
        date: true,
        action: 'dean/register'
    })
})

router.post('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/' + req.session.type + '/dashboard')
    }
    if (req.body) {
        let reqst = req.body
        let college_name = reqst.clgname,
            college_code = reqst.clgcode,
            full_name = reqst.name,
            phone = reqst.phone,
            email_official = reqst.oemail,
            email_personal = reqst.pemail,
            joining_date = reqst.doj,
            experience = reqst.exp,
            password = reqst.password,
            vpassword = reqst.vpassword;

        req
            .checkBody('clgname', 'Enter College name')
            .notEmpty()
        req
            .checkBody('clgcode', 'College code left blank')
            .notEmpty()
        req
            .checkBody('clgcode', 'Incorrect college code')
            .isNumeric()
        req
            .checkBody('name', 'Name is a mandatory field')
            .notEmpty()
        req
            .checkBody('phone', 'Phone number is mandatory')
            .notEmpty()
        req
            .checkBody('phone', 'Invalid Phone Number')
            .isNumeric()
        req
            .checkBody('oemail', 'Enter Official email')
            .notEmpty()
        req
            .checkBody('oemail', 'Invalid official Email')
            .isEmail()
        req
            .checkBody('pemail', 'Enter personal email')
            .notEmpty()
        req
            .checkBody('pemail', 'Invalid Personal email')
            .isEmail()
        req
            .checkBody('doj', 'date of joining is a mandatory field')
            .notEmpty()
        req
            .checkBody('exp', 'Experience is required')
            .notEmpty()
        req
            .checkBody('password', 'Please enter valid password')
            .notEmpty()
        req
            .checkBody('vpassword', 'Please re-enter password')
            .notEmpty()
        req
            .checkBody('vpassword', 'Passwords do not match')
            .equals(reqst.password)
        req
            .checkBody('accept', 'You must agree to the form data provided')
            .equals('on')

        let errors = req.validationErrors()

        if (errors) {
            res.render('register', {
                errors: errors,
                clgname: college_name,
                clgcode: college_code,
                name: full_name,
                phone: phone,
                oemail: email_official,
                pemail: email_personal,
                doj: joining_date,
                exp: experience,
                title: 'Dean Registration',
                path: '../',
                intrested: 'Dean Academics',
                date: true,
                action: 'dean/register'
            })
        } else {
            let new_entry = new model.dean({
                college_name: college_name,
                college_code: college_code,
                full_name: full_name,
                phone: phone,
                pemail: email_personal,
                oemail: email_official,
                date_of_joing: joining_date,
                experience: experience,
                password: password,
                verified: false
            })

            model.dean.createUser(new_entry, (err, model) => {
                if (err) {
                    if (err.code === 11000) {
                        req.flash('error_msg', 'You seem to have already been registered, Please Login to go to the dashboard, or register with a new email.')
                        res.redirect('/dean/register')
                    } else {
                        req.flash('error_msg', 'some error occured, please try again')
                        res.redirect('/dean/register')
                    }
                } else {
                    req.flash('success_msg', 'You are now registered, and can Log In once the admin has approved.')
                    res.redirect('/dean/')
                }
            })
        }
    }
})


router.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        req.flash('error_msg', 'Please login in to acceess Dashboard.')
        return res.redirect('/dean')
    }
    model.hod.findAllUnverified(req.session.code, function (err, user) {
        if (user) {
            model.faculty.findAllUnverifiedSecond(req.session.code, function (err, user2) {
                if (user) {
                    res.render('dashboard', {
                        title: res.locals.type + ' Dashboard',
                        path: '../../',
                        data: user,
                        datafaculty: user2,
                        profile: req.session.details,
                        helpers: {
                            ifcond: function (v1, v2, options) {
                                return (v1 === v2) ? options.fn(this) : options.inverse(this);
                            }
                        }
                    })
                }
            })
        }
    })
})

router.post('/dashboard/verify/hod', (req, res) => {
    if (!req.session.user) {
        req.flash('error_msg', 'Please login in to acceess Dashboard.')
        return res.redirect('/dean')
    }
    if (req.body) {
        let verification = req.body.ver,
            usernames = [];
        if (verification == undefined || verification == null) {
            res.redirect('/dean/dashboard')
        } else {
            model.hod.findAllUnverified(req.session.code, function (err, user) {
                if (user) {
                    for (let i = 0; i < user.length; i++) {
                        usernames.push(user[i].pemail)
                        if (verification[i] === 'on' || verification === 'on') {

                            let email = user[i].pemail,
                                name = user[i].full_name;
                            model.hod.findAndVerify(user[i].pemail, (err, user) => {
                                if (err) throw err;
                                else {

                                    sendMail.sendMail(email, name)
                                }
                            })
                        }

                    }
                    res.redirect('/dean/dashboard')
                } else {
                    return null
                }
            })

        }
    }
})

router.post('/dashboard/verify/faculty', (req, res) => {
    if (!req.session.user) {
        req.flash('error_msg', 'Please login in to acceess Dashboard.')
        res.status(501)
        return res.redirect('/dean')
    }
    if (req.body) {
        let verification = req.body.ver,
            usernames = [];
        if (verification == undefined || verification == null) {
            res.redirect('/dean/dashboard')
        } else {
            model.faculty.findAllUnverifiedSecond(req.session.code, function (err, user) {
                if (user) {
                    for (let i = 0; i < user.length; i++) {
                        usernames.push(user[i].pemail)
                        if (verification[i] === 'on' || verification === 'on') {

                            let email = user[i].pemail,
                                name = user[i].full_name;
                            model.faculty.findAndVerifyTwo(user[i].pemail, (err, user) => {
                                if (err) throw err;
                                else {
                                    library.sendMail.sendMail(email, name)
                                }
                            })
                        }

                    }
                    res.redirect('/dean/dashboard')
                } else {
                    return null
                }
            })

        }
    }
})

router.post('/dashboard/edit', (req, res) => {
    if (!req.session.user) {
        req.flash('error_msg', 'Please login in to acceess Dashboard.')
        return res.redirect('/dean')
    }
    if (req.body) {
        model.dean.getUserByUsername(req.session.user, function (err, user) {
            if (err) throw err;
            if (user) {
                model.dean.comparePassword(req.body.password, user.password, function (err, isMatch) {
                    if (isMatch) {
                        model.dean.editProfile(user.pemail, req.body, (err, user) => {
                            if (err) return res.status(404).send("404")
                            req.session.details = {
                                "college_name": req.body.college_name,
                                "college_code": req.body.college_code,
                                "full_name": req.body.full_name,
                                "phone": req.body.phone,
                                "oemail": req.body.oemail,
                                "pemail": req.body.pemail
                            };
                            req.flash('success_msg', 'Profile Updated.')
                            res.redirect('/dean/dashboard')
                        })
                    }
                    else {
                        req.flash('error_msg', 'Password Incorrect')
                        res.redirect('/dean/dashboard')
                    }
                })
            }
        })
    }
})

module.exports = router;