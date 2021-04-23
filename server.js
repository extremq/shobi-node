if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// Express
const express = require('express')
const app = require('./app')
const expressLayouts = require('express-ejs-layouts')

const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const postRouter = require('./routes/posts')

// Sets
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(methodOverride('_method'))
app.use(expressLayouts)
app.use(express.json({limit: '50mb'}));
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// MongoDB
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to mongoose.'))


// Routes
app.use('/', indexRouter)
app.use('/posts', postRouter)

app.listen(process.env.PORT || 3000)

module.exports = app