let express = require('express'),
    router = express.Router();

router.get('/', (req, res) => {
    res.render('login',{
        title :'Dean Academics Login',
        intrested: 'Dean Academics',
        path : '../',
        reg : '/dean/register'
    })
})

router.post('/', (req, res) => {

})

router.get('/register', (req, res) => {
    res.render('register',{
        title: 'Dean Registration',
        path: '../',
        intrested : 'Dean Academics',
        date: true
    })
})

router.post('/register', (req, res) => {
    if (req.body) {
        let reqst = req.body
        let college_name = reqst.clgname,
            college_code = reqst.clgcode,
            full_name = reqst.name,
            email_official = reqst.email1,
            email_personal = reqst.email2,
            joining_date = reqst.jdate,
            experience = reqst.exp;

            req
                .checkBody('clgname','Enter College name')
                .notEmpty()
            req
                .checkBody('clgcode','College code left blank')
                .notEmpty()
            req
                .checkBody('clgcode','Incorrect college code')
                .isNumeric()
            req
                .checkBody('name','Name is a mandatory field')
                .notEmpty()
            req
                .checkBody('name','Name not valid, no special charachter allowed. Please write your your full name.')
                .not
    }
})


router.get('/dashboard', (req, res) => {
    
})

module.exports = router;