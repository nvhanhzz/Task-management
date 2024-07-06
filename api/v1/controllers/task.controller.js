const Task = require("../models/task.model");

// [GET] /api/v1/task
module.exports.index = async (req, res) => {
    const filter = {
        deleted: false
    };
    const sortObject = {};

    // filter by status
    const status = req.query.status;
    if (status) {
        const listStatus = ["initial", "doing", "finish", "pending", "notFinish"];
        if (listStatus.includes(status)) {
            filter.status = status;
        } else {
            return res.sendStatus(400);
        }
    }
    // end filter by status

    // sort
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    if (sortKey && sortValue) {
        const listKey = ["title", "timeStart", "timeFinish"];
        const listValue = ["asc", "desc"];

        if (listKey.includes(sortKey) && listValue.includes(sortValue)) {
            sortObject[sortKey] = sortValue;
        } else {
            return res.sendStatus(400);
        }
    }
    // sort

    const tasks = await Task.find(filter).sort(sortObject);

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