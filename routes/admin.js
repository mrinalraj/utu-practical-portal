let express = require('express'),
    router = express.Router(),
    dean_model = require('../model/dean_model'),
    hod_model = require('../model/hod_model'),
    faculty_model = require('../model/faculty_model'),
    branch_model = require('../model/createBranch'),
    fun = require('../lib/functions');

router.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/' + req.session.type + '/dashboard')
    }
    res.render('login', {
        title: 'Admin Login',
        intrested: 'Admin',
        path: '../'
    })
})

router.post('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/' + req.session.type + '/dashboard')
    }
    if (req.body) {
        let username = req.body.email,
            password = req.body.pass;
        if (username === 'admin@localhost' && password === 'password') {
            req.session.user = 'admin@localhost'
            req.session.username = 'Admin'
            req.session.type = 'Admin'
            req.flash('success_msg', 'Welcome ' + req.session.username)
            res.redirect('/admin/dashboard')
        } else {
            req.flash('error_msg', 'Invalid Admin Credentials')
            res.redirect('/admin')
        }
    } else {
        re.send('invalid data')
    }
})

router.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        req.flash('error_msg', 'Please login in to acceess Dashboard.')
        return res.redirect('/admin')
    }
    dean_model.findAllUnverified(function (err, user) {
        if (user) {
            res.render('dashboard', {
                title: res.locals.type + ' Dashboard',
                path: '../../',
                data: user,
                helpers: {
                    ifcond: function (v1, v2, options) {
                        return (v1 === v2) ? options.fn(this) : options.inverse(this);
                    }
                }
            })
        }
    })

})

router.post('/dashboard/verify', (req, res) => {
    if (req.body) {
        let verification = req.body.ver,
            usernames = [];
        if (verification == undefined || verification == null) {
            res.redirect('/admin/dashboard')
        } else {
            dean_model.findAllUnverified(function (err, user) {
                if (user) {
                    for (let i = 0; i < user.length; i++) {
                        usernames.push(user[i].pemail)
                        if (typeof verification === "string") {
                            if (verification === 'on') {
                                console.log(verification[i])
                                let email = user[i].pemail,
                                    name = user[i].full_name;
                                dean_model.findAndVerify(user[i].pemail, (err, user) => {
                                    if (err) throw err;
                                    else {
                                        console.log('verified')
                                        fun.sendMail(email, name)
                                    }
                                })
                            }
                        } else {
                            if (verification[i] === 'on') {
                                console.log(verification[i])
                                let email = user[i].pemail,
                                    name = user[i].full_name;
                                dean_model.findAndVerify(user[i].pemail, (err, user) => {
                                    if (err) throw err;
                                    else {
                                        console.log('verified')
                                        fun.sendMail(email, name)
                                    }
                                })
                            }
                        }
                    }
                    res.redirect('/admin/dashboard')
                } else {
                    return null
                }
            })

        }
    }
})

router.post('/addsub', (req, res) => {
    if (req.body) {
        let branch = req.body.branch,
            sub = req.body.sub;
        let subjects = sub.split(',').map(function (item) {
            return item.trim()
        })
        branch_model.findAndUpdate(branch, sub, (err, reply) => {
            if (err) throw err;
            if (reply) {
                req.flash('success_msg', 'subjects added')
            } else {
                req.flash('error_msg', 'subjects add failed. please try again')
            }
            res.redirect('/admin/dashboard')
        })
    }
})


module.exports = router;