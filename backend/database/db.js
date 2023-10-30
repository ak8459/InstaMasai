const mongoose = require('mongoose');
require('dotenv').config()
const connection = mongoose.connect(MONGO_URL);

module.exports = { connection }