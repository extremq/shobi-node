const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    createdAt: {
        type: String,
        required: true
    },
    banner: {
        type: String,
        required: false
    },
    deleteHash: {
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
    },
    comments: {
        type: Object,
        required: true,
        default: {
            arr: [],
            id: 0
        }
    },
    lastAction: {
        type: Object,
        required: true,
        default: {
            type: null,
            author: null
        }
    },
    lastActionDate: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Post', postSchema)