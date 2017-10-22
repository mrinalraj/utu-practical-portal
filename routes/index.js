let express = require('express'),
    router = express.Router();

router.get('/', (req, res) => {
    res.render('home',{
        title : 'Practical Examination Portal | Uttarakhand Technical Unversity'
    })
})

router.get('/logout',(req,res)=>{
    let dest = req.session.type
    req.session.user=null
    req.session.username=null
    req.session.type = null
    req.flash('success_msg','Successully Logged out')
    res.redirect(dest)
})


module.exports = router;