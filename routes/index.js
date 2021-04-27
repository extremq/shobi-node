if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const router = express.Router()
const app = require('../app')

const { now } = require('mongoose')
const User = require('../models/user')
const Post = require('../models/post')
const AuthKey = require('../models/authKey')

const crypto = require('crypto')
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
    saveUninitialized: false,
    cookie: {secure: false, maxAge: 24 * 7 * 60 * 1000}
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

router.get('/authkey', onlyAuth, async (req, res) => {
    // Comment the if/else clause in order to generate the first key
    if (req.session.passport.user != process.env.ADMIN_ID) {
        res.redirect('/')
    }
    else {
        key = new AuthKey({
            key: crypto.randomBytes(20).toString('hex')
        })
        await key.save()
        res.render('authkey.ejs', {
            key: key.key
        })
    }
})

router.get('/update', onlyAuth, async (req, res) => {
    // Comment the if/else clause in order to generate the first key
    if (req.session.passport.user != process.env.ADMIN_ID) {
        res.redirect('/')
    }
    else {
        res.redirect('/')
    }
})

router.post('/register', onlyNotAuth, async (req, res) => {
    try {
        key = await AuthKey.findOne({ key: req.body.key })
        if (key == null) {
            res.redirect('/register')
            return
        }
        else {
            var check = await User.findOne({ name: req.body.name.lower() })
            if (check){
                res.redirect('/register')
            }
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            var user = new User({
                createdAt: Date.now().toString(),
                name: req.body.name.trim().lower(),
                email: req.body.email.trim(),
                password: hashedPassword
            });
            await user.save()
            // console.log(user.id) // uncomment this for setting ADMIN_ID
            await key.remove()
            res.redirect('/login')
        }
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
    admin = process.env.ADMIN_NAME
    next();
});
module.exports = router