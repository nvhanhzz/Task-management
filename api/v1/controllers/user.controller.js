const jwt = require('jsonwebtoken');

const User = require("../models/user.model");
const passwordHelper = require("../middlewares/hashPassword");

// [POST] /api/v1/user/register
module.exports.register = async (req, res) => {
    const existUser = await User.findOne({
        email: req.body.email
    });
    if (existUser) {
        return res.status(409).json({ "message": "Email already in use. Please use a different email address." });
    }

    req.body.password = await passwordHelper.hashPassword(req.body.password);

    const newUser = new User(req.body);
    const register = await newUser.save();
    if (!register) {
        return res.status(500).json({ "message": "Registration failed. Please try again later." });
    }

    return res.status(200).json({ "message": "Registration successful." });
}

// [POST] /api/v1/user/login
module.exports.login = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        deleted: false
    });
    if (!user) {
        return res.status(404).json({ "message": 'Email not found or invalid credentials.' });
    }

    const confirm = await passwordHelper.comparePassword(req.body.password, user.password);
    if (!confirm) {
        return res.status(401).json({ message: 'Incorrect password.' });
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.jwt_signature, { expiresIn: process.env.token_exp });

    res.cookie("token", token, {
        httpOnly: true,
        //        secure: !isDevelopment, Chỉ thiết lập secure khi không ở môi trường phát triển
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24
    });

    return res.status(200).json({ message: 'Login successful.' });
}