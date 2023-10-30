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

postRouter.get('/', async (req, res) => {
    const { minComments, device, maxComments, page } = req.query;
    const postsPerPage = 3;
    let filteredPosts = await PostModel.find({ userId: req.body.userId });
    // Filter by user ID

    // // Filter by min and max comments
    if (minComments && maxComments) {

        filteredPosts = filteredPosts.filter(post => post.no_of_comments
            >= minComments && post.no_of_comments
            <= maxComments);
        console.log(filteredPosts);
    }

    if (device) {
        filteredPosts = filteredPosts.filter(post => post.device === device);
    }
    // Calculate pagination
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    res.json(paginatedPosts);
})


postRouter.get('/top', async (req, res) => {
    const {  page } = req.query;
    const postsPerPage = 3;

    // Filter posts for the logged-in user

    let filteredPosts = await PostModel.find({ userId: req.body.userId });;



    if (filteredPosts.length === 0) {
        return res.status(404).json({ message: 'User not found or has no posts.' });
    }

    // Find the post with the maximum comments
    const topPost = filteredPosts.reduce((max, post) => (post.no_of_comments > max.no_of_comments ? post : max), filteredPosts[0]);

    // Calculate pagination
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;

    res.status(200).json({
        post: topPost,
        userPosts: filteredPosts,
        pagination: {
            page,
            totalPages: Math.ceil(filteredPosts.length / postsPerPage),
        },
    });

})





postRouter.patch('/update/:id', async (req, res) => {

    const { id } = req.params
    const note = await PostModel.findOne({ _id: id });
    console.log(note, id)
    try {

        if (req.body.userId == note.userId) {
            await PostModel.findByIdAndUpdate({ _id: id }, req.body);
            res.status(200).json({ msg: "Note updated successfully" });
        } else {
            res.status(400).json({ msg: "You are not authorized to update this note" });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }



})


postRouter.delete('/delete/:id', async (req, res) => {

    const { id } = req.params
    const note = await PostModel.findOne({ _id: id });
    console.log(note, id)
    try {
        if (req.body.userId == note.userId) {
            await PostModel.findByIdAndDelete({ _id: id }, req.body);
            res.status(200).json({ msg: "Note deleted successfully" });
        } else {
            res.status(400).json({ msg: "You are not authorized to delete this note" });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }

})



module.exports = {
    postRouter
}