const { default: mongoose } = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema(
    {
        email: String,
        otp: String,
        attemptsLeft: Number,
        createdAt: { type: Date, default: Date.now, expires: '3m' }
    }
);

const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema, "forgot-password");

module.exports = ForgotPassword;