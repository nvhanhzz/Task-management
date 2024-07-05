const express = require('express');
const router = express.Router();

const controller = require("../controllers/task.controller");

router.get("/", controller.getTasks);

router.get("/detail/:id", controller.getTaskDetail);

module.exports = router;