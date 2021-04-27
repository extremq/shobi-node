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
        required: true
    }
})

module.exports = mongoose.model('User', userSchema)