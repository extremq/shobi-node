if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const router = express.Router()
const app = require('../app')

const { now } = require('mongoose')
const User = require('../models/user')

const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const initializePassport = require('./passport-config')
initializePassport(
    passport, 
    getUserByName,
    getUserById
)

async function getUserByName(name) {
    if (name)
        return await User.findOne({ name: name})
    return null
}

async function getUserById(id) {
    if (id)
        return await User.findById(id)
    return null
}

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// Default Route
router.get('/', (req, res) => {
    res.redirect('/posts')
})

router.post('/login', onlyNotAuth, passport.authenticate('local', {
    successRedirect: '/posts',
    failureRedirect: '/login',
    failureFlash: true
}))

router.get('/register', onlyNotAuth, (req, res) => {
    res.render('register.ejs')
})

router.post('/register', onlyNotAuth, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        var user = new User({
            createdAt: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        await user.save()
        res.redirect('/login')
    } catch (error) {
        res.redirect('/register')
    }
})

router.get('/login', onlyNotAuth, (req, res) => {
    res.render('login.ejs')
})

router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/posts')
})

function onlyAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function onlyNotAuth(req, res, next) {
    if (!req.isAuthenticated()) {
        return next()
    }
    res.redirect('/posts')
}

app.use(async (req, res, next) => {
    user = await getUserById(req.session?.passport?.user)
    res.locals.user = user
    next();
});
module.exports = router