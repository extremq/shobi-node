const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    createdAt: {
        type: String,
        required: true
    },
    imgLink: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        required: false
    },
    author: {
        type: String,
        required: true
    },
    likers: {
        type: Array,
        required: true 
    }
})

module.exports = mongoose.model('Post', postSchema)
