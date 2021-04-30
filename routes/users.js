const express = require('express')
const { now } = require('mongoose')

const Post = require('../models/post')
const User = require('../models/user')

const router = express.Router()

router.get('/:name', async (req, res) => {
    userProfile = await User.findOne({"name": req.params.name.toLowerCase()}).exec()
    if (userProfile?.name?.toLowerCase() != req.params.name.toLowerCase()) {
        res.redirect('/')
        return
    }
    res.render('profile.ejs', { userProfile })
})
module.exports = router
