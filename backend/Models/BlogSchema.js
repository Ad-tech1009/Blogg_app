const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const paraSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
    }
})

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    content: {
        type: [paraSchema],
        default: []
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }
},{timestamps:true})

const Blog = mongoose.model('Blog', BlogSchema)
module.exports = Blog