let express = require('express'),
    router = express.Router();

router.get('/dashboard', (req, res) => {

})

router.get('/', (req, res) => {
    res.render('login', {
        title: 'Head of Department Login',
        intrested: 'H.O.D.',
        path: '../',
        reg: '/hod/register'
    })
})

router.post('/', (req, res) => {

})

router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Head of Department Registration',
        path: '../',
        intrested: 'H.O.D.',
        date: true,
        branchreq: true
    })
})

router.post('/register', (req, res) => {

})

module.exports = router;