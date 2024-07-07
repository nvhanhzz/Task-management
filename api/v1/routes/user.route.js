const express = require("express");
const router = express.Router();

const validate = require("../validate/user.validate");
const controller = require("../controllers/user.controller");

router.post("/register", validate.register, controller.register);

module.exports = router;