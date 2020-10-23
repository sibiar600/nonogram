const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const PORT = process.env.PORT || 5000

// connect to database
mongoose.connect(
    process.env.MONGODB_CONNECTION_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
)
    .then(() => console.log('mongodb connected'))
    .catch(err => console.log(err))

// import models
const User = require('./models/user')
const Post = require('./models/post')

// middleware
app.use(cors())
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    const path = require('path')
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

//
app.listen(PORT, () => console.log(`server connected at port: ${PORT}`))