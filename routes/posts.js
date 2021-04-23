const express = require('express')
const { now } = require('mongoose')

const Post = require('../models/post')
const User = require('../models/user')

const router = express.Router()

const imageMimeTypes = ['image/jpeg', 'image/png']

const { JSDOM } = require('jsdom')
const md = require('marked')
const createDomPurify = require('dompurify')
const { route } = require('.')
const dompurify = createDomPurify(new JSDOM().window)

async function getUserById(id) {
    if (id)
        return await User.findById(id)
    return null
}

// All Posts Route
router.get('/', async(req, res) => {
    res.render('posts/index')
})

router.get('/page/:page', async (req, res) => {
    itemsPerPage = 5
    page = parseInt(req.params.page)
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
        const posts = await Post.find(searchOptions).sort({ createdAt: -1 })
                                                    .skip(itemsPerPage * (page - 1))
                                                    .limit(itemsPerPage)
        res.render('posts/_posts', { 
            layout: false,
            posts: posts, 
            searchOptions: searchOptions,
            page: page
        })
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
    
})

// New Post Route
router.get('/new', onlyAuth, async (req, res) => {
    res.render('posts/new', { post: new Post() })
})


// New Post Route
router.get('/:id/edit', onlyAuth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (req.session?.passport?.user != post.author) {
            res.redirect('/posts')
        }
        post.tags = post.tags.join(' ')
        res.render('posts/edit', { post: post })
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})


router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        post.markdown = dompurify.sanitize(md(post.markdown))
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
router.post('/', onlyAuth, async (req, res) => {
    // Insert a new Post in our database.
    creator = await getUserById(req.session?.passport?.user)
    const post = new Post({
        createdAt: new Date().toISOString(),
        title: req.body.title.trim().substring(0, 127),
        description: req.body.description.trim().substring(0, 255),
        markdown: req.body.markdown.trim().substring(0, 65535),
        tags: req.body.tags.trim().substring(0, 63).match(/\S+/g) || [],
        author: creator,
        authorName: creator.name,
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
            res.redirect(`posts/${newPost.id}`)
        } catch {
            res.render('posts/new', {
                post: post,
                errorMessage: 'Error creating post.'
            })
        }
})

// Update Post Route
router.put('/:id', onlyAuth, async (req, res) => {
    id = req.params.id
    let oldPost
    try {
        oldPost = await Post.findById(id)
    } catch (e) {
        console.log(e)
        res.redirect('/posts')
    }
    if (req.session?.passport?.user != oldPost.author) {
        res.redirect('/posts')
        return
    }

    // Update the new post
    title = req.body.title.trim().substring(0, 127)
    description = req.body.description.trim().substring(0, 255)
    markdown = req.body.markdown.trim().substring(0, 65535)
    tags = req.body.tags.trim().substring(0, 63).match(/\S+/g) || []
    banner = null

    if (req.body.banner != null && req.body.banner !== '') {
        oldBanner = oldPost.banner
        oldEncoding = oldPost.bannerEncoding
        banner = saveBanner(oldPost, req.body.banner)
    }
    
    // Invalid post types.
    if(description == '' && markdown != ''){
        res.render(`posts/edit`, {
            post: oldPost,
            errorMessage: 'You need to provide a description if you post text.'
        })
    }
    else if(description == '' && markdown == '' && banner == null) {
        res.render(`posts/edit`, {
            post: oldPost,
            errorMessage: 'You need to post an image if you dont have a description/text.'
        })
    }
    else if(banner?.size > 2097152) {
        oldPost.banner = oldBanner
        oldPost.bannerEncoding = oldEncoding
        res.render(`posts/edit`, {
            post: oldPost,
            errorMessage: 'The image is too big (max. 2MB).'
        })
    }
    else 
        try {
            oldPost.title = title
            oldPost.description = description
            oldPost.markdown = markdown
            oldPost.tags = tags
            await oldPost.save()
            res.redirect(`/posts/${id}`)
        } catch {
            res.render(`posts/edit`, {
                post: oldPost,
                errorMessage: 'Error creating post.'
            })
        }
})

// Delete post
router.delete('/:id', onlyAuth, async (req, res) => {
    try {
        post = await Post.findById(req.params.id)
        if (req.session?.passport?.user != post.author) {
            res.redirect('/posts')
        }
        await post.remove()
    }
    catch {
    }
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

module.exports = router