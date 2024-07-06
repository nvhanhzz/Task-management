const Task = require("../models/task.model");

// [GET] /api/v1/task
module.exports.index = async (req, res) => {
    const filter = {
        deleted: false
    }

    // filter by status
    const status = req.query.status;
    const listStatus = ["initial", "doing", "finish", "pending", "notFinish"];
    if (listStatus.includes(status)) {
        filter.status = status;
    } else {
        return res.sendStatus(400);
    }
    // end filter by status


    const tasks = await Task.find(filter);

    return res.status(200).json(tasks);
}

// [GET] /api/v1/task/detail/:id
module.exports.detail = async (req, res) => {
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