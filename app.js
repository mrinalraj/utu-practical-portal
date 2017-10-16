require('dotenv').config()
const express = require('express'),
    app = express(),
    PORT = process.env.PORT || 5000,
    exphbs = require('express-handlebars'),
    expressValidator = require('express-validator'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser'),
    mongo = require('mongodb'),
    flash = require('connect-flash'),
    session = require('express-session'),
    mongoose = require('mongoose');


const index = require(path.resolve(__dirname, 'routes/index')),
    dean = require(path.resolve(__dirname, 'routes/dean')),
    faculty = require(path.resolve(__dirname, 'routes/faculty')),
    hod = require(path.resolve(__dirname, 'routes/hod'));
//mongoose.connect(process.env.MONGODB_URI_LOCAL);
//let db = mongoose.connection;

const favicon = require('serve-favicon')
app.use(favicon(path.resolve(__dirname, 'public/img/utu-logo.png')));

app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
    defaultLayout: 'layout'
}));
app.set('view engine', 'handlebars');
app.use(express.static(path.resolve(__dirname, 'public')))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}))
app.use(flash())

app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null;
    next();
});

app.use('/', index)
app.use('/dean', dean)
app.use('/hod', hod)
app.use('/faculty', faculty)


app.listen(PORT, err => {
    if (err) {
        console.log(err)
    } else {
        console.log("server started at %d", PORT)
    }
})