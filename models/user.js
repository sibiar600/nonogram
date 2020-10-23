const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
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
    pic: {
        type: String,
        default: 'https://res.cloudinary.com/nonoumasy/image/upload/v1603443507/wfr92r6h1jkmqwj4gzfe.jpg'
    },
    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }]
})

module.exports = User = mongoose.model('User', userSchema)

