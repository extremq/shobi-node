const express = require('express')
const { now } = require('mongoose')
const router = express.Router()
const Post = require('../models/post')

// All Posts Route
router.get('/', async (req, res) => {
    let searchOptions = { }
    if (req.query.tags != null && req.query.tags.match("\w") !== null) {
        tags = req.query.tags.match(/\S+/g) || []
        searchOptions.tags = { $all: tags }
    }
    try {
        const posts = await Post.find(searchOptions)
        res.render('posts/index', { 
            posts: posts, 
            searchOptions: searchOptions
        })
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
    
})

// New Post Route
router.get('/new', (req, res) => {
    res.render('posts/new', { post: new Post() })
})

// Create Post Route
router.post('/', async (req, res) => {
    const post = new Post({
        createdAt: new Date().toISOString(),
        imgLink: req.body.imgLink,
        tags: req.body.tags.match(/\S+/g) || [],
        author: "extremq",
        likers: []
    })
    try {
        const newPost = await post.save()
        // res.redirect(`posts/${newPost.id}`)
        res.redirect('posts')
    } catch {
        res.render('posts/new', {
            post: post,
            errorMessage: 'Error creating post.'
        })
    }
})

module.exports = router