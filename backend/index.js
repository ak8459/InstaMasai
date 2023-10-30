const express = require('express');
const { connection } = require('./database/db');

require('dotenv').config()
let port = process.env.PORT || 3000;
const app = express();
app.use(express.json());



// app.use('/user', userRouter);
// app.use('/notes', noteRouter);

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(port, async () => {
    try {
        await connection
        console.log(`Server is running on port ${port}`);
    } catch (error) {
        console.log(error);
    }
})