const mongoose = require('mongoose');



const postSchema = new mongoose.Schema({
    title: String,
    body: String,
    device: String,
    no_of_comments: Number,
}, {
    versionKey: false

})

const PostModel = mongoose.model('Post', postSchema)

module.exports = {
    PostModel
}