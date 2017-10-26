let express = require('express'),
    router = express.Router(),
    model = require('../model/models'),
    library=require('../lib/library');

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
        let ent = new model.createBranch({
            branchName: branches[i]
        })
        model.createBranch.insertBranch(ent, (err, entry) => {
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

router.get('/addDist', (req, res) => {
    library.allotFaculty.internalExaminer()
    library.allotFaculty.externalExaminer()
})

module.exports = router;