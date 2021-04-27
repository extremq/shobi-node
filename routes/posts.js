const express = require('express')
const { now } = require('mongoose')

const Post = require('../models/post')
const User = require('../models/user')

const router = express.Router()

const imgur = require('imgur');
imgur.setClientId(process.env.IMGUR_ID)
imgur.setAPIUrl('https://api.imgur.com/3/')

const fetch = require('node-fetch');

const { JSDOM } = require('jsdom')
const md = require('marked')
const createDomPurify = require('dompurify')
const { route } = require('.')
const post = require('../models/post')
const user = require('../models/user')
const dompurify = createDomPurify(new JSDOM().window)

async function getUserById(id) {
    if (id)
        return await User.findById(id)
    return null
}

function addAction(post, type, author) {
    post.lastAction = { type, author }
    post.lastActionDate = new Date().toISOString()
    post.markModified('lastAction')
}

function addNotification(user, type, author, postID) {
    user.notifications.unshift({
        type: type,
        author: author.name,
        post: postID
    })
    if (user.notifications.length == 6) user.notifications.pop()
    user.markModified('notifications')
}

// All Posts Route
router.get('/', async(req, res) => {
    res.render('posts/index')
})

router.get('/notifications', onlyAuth, async(req, res) => {
    var creator = await getUserById(req.session?.passport?.user)
    notifications = creator.notifications
    count = notifications.length
    res.render('posts/_notifications', {
        layout: false,
        count: count,
        notifications: notifications
    })
})

router.get('/tags', async (req, res) => {
    let siteTags = { }
    tagCount = 0
    posts = await Post.find({})
    posts.forEach(post => {
        if (post.tags.length > 0) tagCount += 1
        post.tags.forEach(tag => {
            if (siteTags[tag] == null) siteTags[tag] = 1
            else siteTags[tag] += 1
        });
    });
    siteTags = Object.fromEntries(
        Object.entries(siteTags).sort(([,a],[,b]) => b-a).slice(0, 10)
    );
    res.render('posts/_tags', {
        layout: false,
        tags: siteTags,
        count: tagCount
    })
})

router.delete('/:id/comment/:index', onlyAuth, async (req, res) => {
    var post = await Post.findById(req.params.id)
    if (post?.id != req.params.id) {
        res.redirect('/posts/' + req.params.id)
        return
    }
    if (req.params.index >= 0) {
        requester = await getUserById(req.session?.passport?.user)
        comment_index = post.comments.arr.findIndex((item) => {
            return item.id == req.params.index
        })
        comment = post.comments.arr[comment_index]
        author = comment.author
        if (author != requester.name && process.env.ADMIN_ID != req.session?.passport?.user) {
            res.redirect('/posts/' + req.params.id)
            return
        }
        post.comments.arr.splice(comment_index, 1)
        post.markModified('comments')
        await post.save()
    }
    res.redirect('/posts/' + req.params.id)
})

router.post('/:id/comment', onlyAuth, async (req, res) => {
    var post = await Post.findById(req.params.id)
    if (post?.id != req.params.id) {
        res.redirect('/posts/' + req.params.id)
        return
    }
    comment = req.body.comment.trim().substring(0, 255)
    if (comment.length > 1) {
        creator = await getUserById(req.session?.passport?.user)
        notifiedAuthors = {}

        // NOTIFICATIONS -- firstly, we notify the post creator
        postCreator = await getUserById(post.author)
        notifiedAuthors[postCreator.name] = true
        if (postCreator.name != creator.name)
            addNotification(postCreator, "commented on your post", creator, req.params.id)
        await postCreator.save()
        // Then, we notify whoever was tagged (ex: @extremq)
        const findMentions = [...comment.matchAll('@([a-z\-_0-9]{3,16})')]
        findMentions.forEach(async mention => {
            if (notifiedAuthors[mention] == null) {
                notifiedAuthors[mention] = true
                mentioned = await User.findOne({ "name": mention})
                addNotification(mentioned, "tagged you in a comment", creator, req.params.id)
                await mentioned.save()
            }
        })
        // Lastly, we notify users who also commented on the post
        post.comments.arr.forEach(async comment => {
            if (notifiedAuthors[comment.author] == null && comment.author != creator.name) {
                notifiedAuthors[comment.author] = true
                commenter = await User.findOne({ "name": comment.author })
                addNotification(commenter, "commented on a post you also commented on", creator, req.params.id)
                await commenter.save()
            }
        })
        post.comments.id += 1 
        post.comments.arr.push({
            id: post.comments.id,
            text: comment,
            createdAt: new Date().toISOString(),
            author: creator.name
        })
        addAction(post, "commented on", creator.name)
        post.markModified('comments')
        await post.save()
    }
    res.redirect('/posts/' + req.params.id)
})

router.get('/:id/like', onlyAuth, async(req, res) => {
    var post = await Post.findById(req.params.id)
    if (post?.id != req.params.id) {
        res.redirect('/posts/' + req.params.id)
        return
    }
    var creator = await getUserById(req.session?.passport?.user)
    if (post.likers.indexOf(creator) != -1) {
        res.redirect('/posts/' + req.params.id)
        return
    }
    var postCreator = await getUserById(post.author)
    post.likers.push(creator.name)
    addNotification(postCreator, "liked your post", creator, req.params.id)
    addAction(post, "liked", creator.name)
    await postCreator.save()
    await post.save()
    res.redirect('/posts/' + req.params.id)
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
    if (req.query.author && req.query.author.trim() != '') {
        author = req.query.author.trim()
        searchOptions.authorName = { $regex: author, $options: 'i'}
    }
    if (req.query.markdown && req.query.markdown.trim() != '') {
        markdown = req.query.markdown.trim()
        searchOptions.markdown = { $regex: markdown, $options: 'i'}
    }
    try {
        criteria = req.query?.creation == "on" ? "createdAt" : "lastActionDate"
        order = req.query?.oldest == "on" ? 1 : -1
        sorting = {}
        sorting[criteria] = order
        const posts = await Post.find(searchOptions).sort(sorting)
                                                    .skip(itemsPerPage * (page - 1))
                                                    .limit(itemsPerPage)

        res.set("x-post-count", posts.length)
        res.render('posts/_posts', {
            layout: false,
            posts: posts,
            searchOptions: searchOptions,
            page: page
        })
    } catch (e) {
        console.log(e)
        res.set("x-post-count", -1)
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
        if (req.session?.passport?.user != post.author && process.env.ADMIN_ID != req.session?.passport?.user) {
            res.redirect('/posts')
            return
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

// Create Post Route
router.post('/', onlyAuth, async (req, res) => {
    let banner
    try {
        if (req.body.banner?.length > 10)
        banner = JSON.parse(req.body.banner)
    }
    catch (e){
        console.log(e)
    }
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
        likers: [],
        comments: {
            id: 0,
            arr: []
        },
        lastActionDate: new Date().toISOString()
    })
    post.tags = [...new Set(post.tags)];

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
    else if(banner?.size > 10485760) {
        res.render('posts/new', {
            post: post,
            errorMessage: 'The image is too big (max. 10MB).'
        })
    }
    else
        try {
            if (banner) {
                let imgurPost
                fetch("https://api.imgur.com/3/image", {
                    method: "POST",
                    headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Authorization": "Client-ID 0822748160b706a"
                        },
                    body: `type=base64&image=${encodeURIComponent(banner?.data)}`
                    }).then((resp) => resp.json()).then(async (data) => {
                        post.banner = data.data.link
                        post.deleteHash = data.data.deletehash
                        const newPost = await post.save()
                        res.redirect(`posts/${newPost.id}`)
                        return
                    }).catch((err) => {
                        console.error(err)
                })
            }
            else {
                const newPost = await post.save()
                res.redirect(`posts/${newPost.id}`)
                return
            }
        } catch (err) {
            console.error(err)
            res.render('posts/new', {
                post: post,
                errorMessage: 'Error creating post.'
            })
        }
})

// Update Post Route
router.put('/:id', onlyAuth, async (req, res) => {
    let banner
    try {
        if (req.body.banner?.length > 10)
        banner = JSON.parse(req.body.banner)
    }
    catch (e){
        console.log(e)
    }
    id = req.params.id
    let post
    try {
        post = await Post.findById(id)
    } catch (e) {
        console.log(e)
        res.redirect('/posts')
        return
    }
    if (req.session?.passport?.user != post.author && process.env.ADMIN_ID != req.session?.passport?.user) {
        res.redirect('/posts')
        return
    }

    // Update the new post
    title = req.body.title.trim().substring(0, 127)
    description = req.body.description.trim().substring(0, 255)
    markdown = req.body.markdown.trim().substring(0, 65535)
    tags = req.body.tags.trim().substring(0, 63).match(/\S+/g) || []
    tags = [...new Set(tags)];

    // Invalid post types.
    if(description == '' && markdown != ''){
        res.render(`posts/edit`, {
            post: post,
            errorMessage: 'You need to provide a description if you post text.'
        })
    }
    else if(description == '' && markdown == '' && banner == null) {
        res.render(`posts/edit`, {
            post: post,
            errorMessage: 'You need to post an image if you dont have a description/text.'
        })
    }
    else if(banner?.size > 10485760) {
        res.render(`posts/edit`, {
            post: post,
            errorMessage: 'The image is too big (max. 10MB).'
        })
    }
    else
        try {
            post.title = title
            post.description = description
            post.markdown = markdown
            post.tags = tags
            if (banner) {
                fetch("https://api.imgur.com/3/image", {
                    method: "POST",
                    headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Authorization": "Client-ID " + process.env.IMGUR_ID
                        },
                    body: `type=base64&image=${encodeURIComponent(banner?.data)}`
                    }).then((resp) => resp.json()).then(async (data) => {
                        post.banner = data.data.link
                        post.deleteHash = data.data.deletehash
                        await post.save()
                        res.redirect(`${id}`)
                        return
                    }).catch((err) => {
                        console.error(err)
                })
            }
            else {
                await post.save()
                res.redirect(`${id}`)
                return
            }
        } catch {
            res.render(`posts/edit`, {
                post: post,
                errorMessage: 'Error creating post.'
            })
        }
})

// Delete post
router.delete('/:id', onlyAuth, async (req, res) => {
    try {
        post = await Post.findById(req.params.id)
        if (req.session?.passport?.user != post.author && process.env.ADMIN_ID != req.session?.passport?.user) {
            res.redirect('/posts')
            return
        }
        if (post.deleteHash != null) {
            fetch("https://api.imgur.com/3/image/" + post.deleteHash, {
                    method: "DELETE",
                    headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Authorization": "Client-ID " + process.env.IMGUR_ID
                        }
                    }).then((resp) => resp.json()).then((data) => {

                    }).catch((err) => {
                        console.error(err)
            })
        }
        await post.remove()
        res.redirect('/posts')
        return
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