const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    createdAt: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    stats: {
        type: Object,
        required: true
    },
    notifications: {
        type: Array,
        required: true,
        default: [{
            type: "welcomes you",
            author: "extremq",
            post: "60834d142ba764001559f658"
        }]
    }
})

module.exports = mongoose.model('User', userSchema)