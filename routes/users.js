const express = require('express')
const { now } = require('mongoose')

const Post = require('../models/post')
const User = require('../models/user')

const router = express.Router()

router.get('/:name', async (req, res) => {
    user = await User.findOne({"name": req.params.name}).exec()
    if (user?.name != req.params.name) {
        res.redirect('/')
        return
    }
    res.render('profile.ejs', { user })
})
module.exports = router