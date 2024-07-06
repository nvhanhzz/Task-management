const express = require('express');
const router = express.Router();

const controller = require("../controllers/task.controller");

router.get("/detail/:id", controller.detail);

router.patch("/change-multi", controller.changeMulti);

router.patch("/change-status/:id", controller.changeStatus);

router.get("/", controller.index);

module.exports = router;