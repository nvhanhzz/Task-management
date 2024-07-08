const express = require("express");
const router = express.Router();

const validate = require("../validate/user.validate");
const controller = require("../controllers/user.controller");

router.post("/register", validate.register, controller.register);

router.post("/login", validate.login, controller.login);

module.exports = router;