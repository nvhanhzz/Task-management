const Task = require("../models/task.model");

// [GET] /api/v1/task
module.exports.getTasks = async (req, res) => {
    const tasks = await Task.find({
        deleted: false
    });

    return res.status(200).json(tasks);
}

// [GET] /api/v1/task/detail/:id
module.exports.getTaskDetail = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findOne({
            _id: taskId,
            deleted: false
        });

        if (task) {
            return res.status(200).json(task);
        } else {
            return res.sendStatus(404);
        }
    } catch (error) {
        return res.sendStatus(500);
    }
}