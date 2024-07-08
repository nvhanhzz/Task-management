const User = require("../models/user.model");
const ForgotPassword = require("../models/forgotPassword.model");
const passwordHelper = require("../../../helper/hashPassword");
const generateHelper = require("../../../helper/generate");
const senMailHelper = require("../../../helper/senMail");
const generateTokenHelper = require("../../../helper/generateToken");

const TOKEN_EXP = parseInt(process.env.TOKEN_EXP, 10);
const TEMP_TOKEN_EXP = parseInt(process.env.TEMP_TOKEN_EXP, 10);

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

    generateTokenHelper.generateToken(res, user.id, TOKEN_EXP, "token");

    return res.status(200).json({ message: 'Login successful.' });
}

// [POST] /api/v1/user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    const email = req.body.email;
    const existUser = await User.findOne({
        email: email
    });
    if (!existUser) {
        return res.status(404).json({ "message": 'Email not found or invalid credentials.' });
    }

    // create OTP
    const otp = generateHelper.generateOTP(8);
    const attemptsLeft = 5;
    const forgotPassword = new ForgotPassword({
        email: email,
        otp: otp,
        attemptsLeft: attemptsLeft
    });

    const save = await forgotPassword.save();
    if (!save) {
        return res.status(500).json({ message: "Internal server error." });
    }
    // end create OTP

    // send mail
    const subject = `Mã OTP xác minh lấy lại mật khẩu`
    const html = `Mã OTP là <b>${otp}</b>. Thời hạn sử dụng là 3 phút. Lưu ý không được để lộ mã này.`
    senMailHelper.sendMail(email, subject, html);
    // end send mail

    // create temp token
    generateTokenHelper.generateToken(res, existUser.id, TEMP_TOKEN_EXP, "verify_otp_token");
    // end create temp token

    return res.status(200).json({ message: "OTP sent successfully." });
}

// [POST] /api/v1/user/password/verify-otp
module.exports.forgotPassword = async (req, res) => {
    // const verifyOtpToken = req.cookies
}