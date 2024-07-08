const express = require("express");
const router = express.Router();

const validate = require("../validate/user.validate");
const controller = require("../controllers/user.controller");

router.post("/register", validate.register, controller.register);

router.post("/login", validate.login, controller.login);

router.post("/password/forgot", validate.forgotPassword, controller.forgotPassword);

module.exports = router;