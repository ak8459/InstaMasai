const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    age: Number,
    city: String,
    is_married: Boolean

}, {
    versionKey: false

})

const User = mongoose.model('User', userSchema)

module.exports = {
    User
}