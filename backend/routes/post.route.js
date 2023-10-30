const express = require('express')
const postRouter = express.Router();
const { PostModel } = require('../model/posts.model')
const { auth } = require('../middleware/auth.middleware')


postRouter.use(auth)

postRouter.post('/add', async (req, res) => {
    try {
        const note = new PostModel(req.body);
        await note.save();
        res.status(200).json({ msg: "Post created successfully" });
    } catch (error) {
        console.log('not authorized');
        res.status(500).json({ msg: error.message });
    }
})

module.exports = {
    postRouter
}