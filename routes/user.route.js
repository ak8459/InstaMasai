
const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../model/users.model');
const jsonwebtoken = require('jsonwebtoken');
const userRouter = express.Router();
const { BlackListModel } = require('../model/token.model')


// Sign up
userRouter.post('/register', async (req, res) => {
    const { name, email, password, age, city, is_married } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exist, please login" });
        }


        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                res.status(404).json({ msg: err.message });
            } else {
                const user = new User({ name, email, password: hash, age, city, is_married });
                await user.save();
                res.status(200).json({ msg: "User registered successfully" });
            }
        })

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
})

// sign in
userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(400).json({ msg: "User does not exist" });
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                const token = jsonwebtoken.sign({ email: user.email, userId: user._id }, 'user-key', { expiresIn: '7d' });
                res.status(200).json({ msg: "Login successful", token });
            } else {
                res.status(400).json({ msg: "Invalid credentials" });
            }
        })
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
})


userRouter.get('/logout', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    console.log(token);
    try {
        if (token) {
            await BlackListModel.updateMany({}, { $push: { blacklist: [token] } });
            res.status(200).json({ msg: "User has been logged out" });
          }

    } catch (error) {
        res.status(400).send({ "error": error })
    }

})



module.exports = {
    userRouter
}