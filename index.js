const express = require('express');
const { connection } = require('./database/db');
const { userRouter } = require('./routes/user.route');
require('dotenv').config()
const cors = require('cors')
const { postRouter } = require('./routes/post.route')
let port = process.env.PORT
const app = express();
app.use(express.json());
app.use(cors())



app.use('/users', userRouter);
app.use('/posts', postRouter)



app.listen(port, async () => {
    try {
        await connection
        console.log(`Server is running on port ${8080}`);
    } catch (error) {
        console.log(error);
    }
})