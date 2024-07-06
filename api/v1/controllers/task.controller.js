const Task = require("../models/task.model");
const paginationHelper = require("../../../helper/pagination");
const searchHelper = require("../../../helper/search");

// [GET] /api/v1/task
module.exports.index = async (req, res) => {
    const query = req.query;
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

    //search
    const search = searchHelper.search(query);
    const regex = search.regex;
    if (regex) {
        filter.title = regex;
    }
    //end search

    // sort
    const sortKey = query.sortKey;
    const sortValue = query.sortValue;
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

    // pagination
    const limit = 3;
    const total = await Task.countDocuments(filter);
    const pagination = paginationHelper.pagination(query, limit, total);
    // end pagination

    const tasks = await Task.find(filter).sort(sortObject).skip(pagination.skip).limit(pagination.limit);

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