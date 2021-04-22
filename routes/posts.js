const express = require('express')
const { now } = require('mongoose')

const Post = require('../models/post')

const router = express.Router()

const imageMimeTypes = ['image/jpeg', 'image/png']

const md = require('markdown-it')({
    linkify: true,
    typographer: true,
    quotes: '“”‘’',
})

// All Posts Route
router.get('/', async (req, res) => {
    let searchOptions = { }
    if (req.query.tags && req.query.tags.trim() != '') {
        tags = req.query.tags.match(/\S+/g) || []
        searchOptions.tags = { $all: tags }
    }
    if (req.query.title && req.query.title.trim() != '') {
        title = req.query.title.trim()
        searchOptions.title = { $regex: title, $options: 'i'}
    }
    if (req.query.description && req.query.description.trim() != '') {
        description = req.query.description.trim()
        searchOptions.description = { $regex: description, $options: 'i'}
    }
    if (req.query.markdown && req.query.markdown.trim() != '') {
        markdown = req.query.markdown.trim()
        searchOptions.markdown = { $regex: markdown, $options: 'i'}
    }
    try {
        const posts = await Post.find(searchOptions)
        posts.forEach(post => {
            post.markdown = md.render(post.markdown)
        })
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
router.get('/new', async (req, res) => {
    res.render('posts/new', { post: new Post() })
})

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        post.markdown = md.render(post.markdown)
        res.render('posts/post', { post })
    } catch {
        res.redirect('../posts')
    }
})

function saveBanner(post, bannerEncoded) {
    if (bannerEncoded == null) {
        return
    }
    banner = null
    try {
        banner = JSON.parse(bannerEncoded)
        if (banner != null && imageMimeTypes.includes(banner.type)) {
            post.banner = new Buffer.from(banner.data, 'base64')
            post.bannerEncoding = banner.type
        }
    }
    catch {

    }
    return banner
}

// Create Post Route
router.post('/', async (req, res) => {
    // Insert a new Post in our database.
    const post = new Post({
        createdAt: new Date().toISOString(),
        title: req.body.title.trim().substring(0, 127),
        description: req.body.description.trim().substring(0, 255),
        markdown: req.body.markdown.trim().substring(0, 65535),
        tags: req.body.tags.trim().substring(0, 63).match(/\S+/g) || [],
        author: "extremq",
        likers: []
    })
    banner = saveBanner(post, req.body.banner)
    
    // Invalid post types.
    if(post.description == '' && post.markdown != ''){
        await res.render('posts/new', {
            post: post,
            errorMessage: 'You need to provide a description if you post text.'
        })
    }
    else if(post.description == '' && post.markdown == '' && banner == null) {
        res.render('posts/new', {
            post: post,
            errorMessage: 'You need to post an image if you dont have a description/text.'
        })
    }
    else if(banner?.size > 2097152) {
        res.render('posts/new', {
            post: post,
            errorMessage: 'The image is too big (max. 2MB).'
        })
    }
    else 
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