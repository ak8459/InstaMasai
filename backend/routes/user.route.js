
const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../model/users.model');
const userRouter = express.Router();

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





module.exports = {
    userRouter
}