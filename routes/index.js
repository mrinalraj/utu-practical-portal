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



router.post("/login", (req, res) => {
    if (req.body) {
        let username = req.body.name,
            password = req.body.password;
        //validate();
        let session_var = req.session
        session_var.user = username
        res.write('logged in as ' + username);
        res.end();
    } else {
        res.write();
    }
})

router.get("/dashboard", (req, res) => {
    let session_var = req.session
    if (!session_var.user) {
        res.status(401)
        res.write('not logged in');
        res.end();
    } else {
        res.status(200)
        res.write("hello " + session_var.user);
        res.end();
    }
})



module.exports = router;