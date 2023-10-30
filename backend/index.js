const express = require('express');
const { connection } = require('./database/db');
const { userRouter } = require('./routes/user.route');
require('dotenv').config()
let port = process.env.PORT || 3000;
const app = express();
app.use(express.json());



app.use('/users', userRouter);


app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(8080, async () => {
    try {
        await connection
        console.log(`Server is running on port ${8080}`);
    } catch (error) {
        console.log(error);
    }
})