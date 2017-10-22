let express = require('express'),
    router = express.Router();

router.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect(req.session.type + '/dashboard')
    }
    res.render('login', {
        title: 'Admin Login',
        intrested: 'Admin',
        path: '../'
    })
})

router.post('/',(req,res)=>{
    if (req.session.user) {
        return res.redirect(req.session.type + '/dashboard')
    }
    if (req.body) {
        let username = req.body.email,
            password = req.body.pass;
        if(username === 'admin@localhost' && password === 'password'){
            req.session.user = 'admin@localhost'
            req.session.username = 'Admin'
            req.session.type = '/admin'
            req.flash('success_msg', 'logged in as ' + req.session.username)
            res.redirect('/admin/dashboard')
        }
        else{
            req.flash('error_msg','Invalid Admin Credentials')
            res.redirect('/admin')
        }
    }
    else{
        re.send('invalid data')
    }
})

router.get('/dashboard',(req,res)=>{
    if(!req.session.user){
        req.flash('error_msg','Please login in to acceess Dashboard.')
        return res.redirect('/admin')
    }
    res.send('logged in user is ' + req.session.username)
})

module.exports= router;