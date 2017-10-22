let express = require('express'),
    router = express.Router(),
    model = require('../model/dean_model');

router.get('/', (req, res) => {
    if(req.session.user){
        return res.redirect('/'+req.session.type+'/dashboard')
    }
    res.render('login', {
        title: 'Dean Academics Login',
        intrested: 'Dean Academics',
        path: '../',
        reg: '/dean/register'
    })
})

router.post('/', (req, res) => {
    if(req.session.user){
        return res.redirect('/'+req.session.type+'/dashboard')
    }
    if (req.body) {
        let username = req.body.email,
            password = req.body.pass;

        model.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                req.flash('error_msg', 'User Not found');
                res.redirect('/dean')
            } else {
                if (user.verified === true) {
                    model.comparePassword(password, user.password, (err, ismatch) => {
                        if (err) throw err;
                        if (ismatch) {
                            req.session.user = username
                            req.session.username = user.full_name
                            req.session.type = 'Dean'
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
    if(req.session.user){
        return res.redirect('/'+req.session.type+'/dashboard')
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
    if(req.session.user){
        return res.redirect('/'+req.session.type+'/dashboard')
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
            let new_entry = new model({
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

            model.createUser(new_entry, (err, model) => {
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
    if(!req.session.user){
        req.flash('error_msg','Please login in to acceess Dashboard.')
        return res.redirect('/dean')
    }
    res.render('dashboard', {
        title: res.locals.type + ' Dashboard',
        path: '../../',
        helpers: {
            ifcond: function (v1, v2, options) {
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            }
        }
    })
})

module.exports = router;