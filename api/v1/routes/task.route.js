const express = require('express');
const router = express.Router();

const validate = require("../validate/task.validate");
const controller = require("../controllers/task.controller");

router.get("/detail/:id", controller.detail);

router.patch("/change-multi", controller.changeMulti);

router.patch("/change-status/:id", controller.changeStatus);

router.post("/create", validate.create, controller.create);

router.patch("/update/:id", validate.create, controller.update);

router.delete("/delete/:id", controller.delete);

router.get("/", controller.index);

module.exports = router;