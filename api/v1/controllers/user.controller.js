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