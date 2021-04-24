const mongoose = require('mongoose')

const authKeySchema = new mongoose.Schema({
    key: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('AuthKey', authKeySchema)