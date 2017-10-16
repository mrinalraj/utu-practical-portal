let express = require('express'),
    router = express.Router();

router.get('/', (req, res) => {
    res.render('home',{
        title : 'Practical Examination Portal | Uttarakhand Technical Unversity'
    })
})


router.get('/admin', (req, res) => {
    
})

router.post('/admin', (req, res) => {

})


module.exports = router;