if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

var express = require('express')

var app = express()

module.exports = app