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
    const { minComments, maxComments, pageNo, limit, device1, device2 } = req.query;
    // const postsPerPage = 3;
    // let filteredPosts = await PostModel.find({ userId: req.body.userId });
    const skip = (pageNo - 1) * limit;
    const { userId } = req.body

    let query = {};
    if (userId) {
        query.userId = userId
    }

    // // Filter by min and max comments
    if (minComments && maxComments) {

        query.no_of_comments = {
            $and: [
                { no_of_comments: { $gte: minComments } },
                { no_of_comments: { $lte: maxComments } },
            ],
        }
    }

    if (device1 && device2) {
        query.device = {
            $and: [
                { device: { $eq: device1 } },
                { device: { $eq: device2 } },
            ],
        }
    } else if (device1) {
        query.device = device1
    } else if (device2) {
        query.device = device2
    }
    try {
        const posts = await PostModel.find(query).sort({ no_of_comments: 1 }).skip(skip).limit(limit);
        res.status(200).json({ msg: "Users posts", posts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
})


postRouter.get('/top', async (req, res) => {
    const postsPerPage = 3;
    const { page } = req.query;
    // Filter posts for the logged-in user

    let filteredPosts = await PostModel.find({ userId: req.body.userId });;

    console.log(filteredPosts);


    if (filteredPosts.length === 0) {
        return res.status(404).json({ message: 'User not found or has no posts.' });
    }

    // Find the post with the maximum comments
    const topPost = filteredPosts.reduce((max, post) => (post.no_of_comments > max.no_of_comments ? post : max), filteredPosts[0]);

    // Calculate pagination
    // const startIndex = (page - 1) * postsPerPage;
    // const endIndex = startIndex + postsPerPage;
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    res.status(200).json({
        post: topPost,
        userPosts: paginatedPosts,
        pagination: {
            page,
            totalPages: Math.ceil(filteredPosts.length / postsPerPage),
        },
    });

})





postRouter.patch('/update/:id', async (req, res) => {

    const { id } = req.params
    const note = await PostModel.findOne({ _id: id });

    try {
        if (req.body.email == note.email) {


            await PostModel.findByIdAndUpdate({ _id: id }, req.body);

            res.status(200).json({ msg: "Post updated successfully" });
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

    console.log(note, id).
        console.log(req.body.userId == note.userId);
    try {
        if (req.body.userId) {
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