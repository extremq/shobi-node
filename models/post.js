const mongoose = require('mongoose')

const bannerImageBasePath = 'uploads/banners'

const postSchema = new mongoose.Schema({
    createdAt: {
        type: String,
        required: true
    },
    banner: {
        type: Buffer,
        required: false
    },
    bannerEncoding: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
    },
    markdown: {
        type: String,
        required: false
    },
    tags: {
        type: Array,
        required: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    likers: {
        type: Array,
        required: true 
    }
})

module.exports = mongoose.model('Post', postSchema)
module.exports.bannerImageBasePath = bannerImageBasePath