const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth");

const validate = require("../validate/user.validate");
const controller = require("../controllers/user.controller");

router.use((req, res, next) => {
    if (["/logout", "/information", "/list"].includes(req.path)) {
        return next();
    }
    return authMiddleware.isLoggedOut(req, res, next);
});

router.post("/register", validate.register, controller.register);

router.post("/login", validate.login, controller.login);

router.post("/logout", controller.logout);

router.post("/password/forgot", validate.forgotPassword, controller.forgotPassword);

router.post("/password/verify-otp", validate.verifyOtp, authMiddleware.checkToken({ tokenName: 'verify_otp_token', type: 'userVerifyOtp' }), controller.verifyOtp);

router.post("/password/reset", validate.resetPassword, authMiddleware.checkToken({ tokenName: 'reset-password-token', type: 'userResetPassword' }), controller.resetPassword);

router.get("/information", controller.information);

router.get("/list", authMiddleware.isLoggedIn, controller.listUser);

module.exports = router;