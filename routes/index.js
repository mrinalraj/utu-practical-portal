let express = require('express'),
    router = express.Router(),
    branch = require('../model/createBranch');

router.get('/', (req, res) => {
    createBranches()
    res.render('home', {
        title: 'Practical Examination Portal | Uttarakhand Technical Unversity',
        dp: true
    })
})

function createBranches() {
    let branches = [
        "Computer Science",
        "Information Technology",
        "Civil Engineering",
        "Mechanical Engineering",
        "Electronics Engineering",
        "Electrical Engineering"
    ]
    for (let i = 0; i < branches.length; i++) {
        let ent = new branch({
            branchName: branches[i]
        })
        branch.insertBranch(ent, (err, entry) => {
            if (err) {}
        })
    }
}

router.get('/logout', (req, res) => {
    let dest = req.session.type
    req.session.user = null
    req.session.username = null
    req.session.type = null
    req.flash('success_msg', 'Successully Logged out')
    res.redirect(dest)
})

module.exports = router;