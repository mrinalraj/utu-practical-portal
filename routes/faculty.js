let express = require('express'),
    router = express.Router()
    model = require('../model/faculty_model');

router.get('/', (req, res) => {
    if(req.session.user){
        return res.redirect(req.session.type+'/dashboard')
    }
    res.render('login',{
        title :'Faculty Login',
        intrested: 'Faculty',
        path : '../',
        reg: '/faculty/register'
    })
})

router.post('/', (req, res) => {
    if(req.session.user){
        return res.redirect(req.session.type+'/dashboard')
    }
    if (req.body) {
        let username = req.body.email,
            password = req.body.pass;

        model.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                req.flash('error_msg', 'User Not found');
                res.redirect('/faculty')
            } else {
                if (user.verified === true) {
                    model.comparePassword(password, user.password, (err, ismatch) => {
                        if (err) throw err;
                        if (ismatch) {
                            req.session.user = username
                            req.session.username = user.full_name
                            req.session.type = '/faculty'
                            req.flash('success_msg', 'logged in as ' + req.session.username)
                            res.redirect('/faculty/dashboard')
                        } else {
                            req.flash('error_msg', 'invalid password')
                            res.redirect('/faculty?user=' + username)
                        }
                    })
                } else {
                    req.flash('error_msg', "User Login not verified. Please contact the concerned personnel.")
                    res.redirect('/faculty')
                }

            }
        })
    } else {
        res.send('invalid data')
    }
})

router.get('/register', (req, res) => {
    if(req.session.user){
        return res.redirect(req.session.type+'/dashboard')
    }
    res.render('register', {
        title: 'Faculty Registration',
        path: '../',
        intrested: 'Faculty',
        desi :true,
        branchreq: true,
        action:'faculty/register'
    })
})

router.post('/register', (req, res) => {
    if(req.session.user){
        return res.redirect(req.session.type+'/dashboard')
    }
    if (req.body) {
        let reqst = req.body
        let college_name = reqst.clgname,
            college_code = reqst.clgcode,
            full_name = reqst.name,
            branch=reqst.branch,
            des=reqst.des,
            phone = reqst.phone,
            email_official = reqst.oemail,
            email_personal = reqst.pemail,
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
            .checkBody('branch', 'Name is a mandatory field')
            .notEmpty()
        req
            .checkBody('des', 'date of joining is a mandatory field')
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
                des: des,
                oemail: email_official,
                pemail: email_personal,
                exp: experience,
                title: 'Faculty Registration',
                path: '../',
                intrested: 'Faculty',
                date: true,
                action: 'faculty/register'
            })
        } else {
            let new_entry = new model({
                college_name: college_name,
                college_code: college_code,
                full_name: full_name,
                branch:branch,
                designation:des,
                phone: phone,
                pemail: email_personal,
                oemail: email_official,
                experience: experience,
                password: password,
                verified: false
            })

            model.createUser(new_entry, (err, model) => {
                if (err) throw err;
                req.flash('success_msg', 'You are now registered, and can Log In once the admin has approved.')
                res.redirect('/faculty')
            })
        }
    }
})

router.get('/dashboard', (req, res) => {
    if(!req.session.user){
        req.flash('error_msg','Please login in to acceess Dashboard.')
        return res.redirect('/faculty')
    }
    res.send('logged in user is ' + req.session.username)
})


module.exports = router;