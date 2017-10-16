let express = require('express'),
    router = express.Router();

router.get('/dashboard', (req, res) => {

})

router.get('/', (req, res) => {
    res.render('login',{
        title :'Faculty Login',
        intrested: 'Faculty',
        path : '../',
        reg: '/faculty/register'
    })

})

router.post('/', (req, res) => {

})

router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Faculty Registration',
        path: '../',
        intrested: 'Faculty',
        desi :true,
        branchreq: true
    })
})

router.post('/register', (req, res) => {

})


module.exports = router;