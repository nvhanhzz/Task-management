const Task = require("../models/task.model");
const paginationHelper = require("../../../helper/pagination");
const searchHelper = require("../../../helper/search");

const listStatus = ["initial", "doing", "finish", "pending", "notFinish"];

// [GET] /api/v1/task
module.exports.index = async (req, res) => {
    const query = req.query;
    const filter = {
        deleted: false,
        $or: [
            { createdBy: req.currentUser._id },
            { participants: req.currentUser._id }
        ]
    };
    const sortObject = {};

    // filter by status
    const status = req.query.status;
    if (status) {
        if (listStatus.includes(status)) {
            filter.status = status;
        } else {
            return res.status(400).json({ message: "Invalid status value" });
        }
    }
    // end filter by status

    // search
    const search = searchHelper.search(query);
    const regex = search.regex;
    if (regex) {
        filter.title = regex;
    }
    // end search

    // sort
    const sortKey = query.sortKey;
    const sortValue = query.sortValue;
    if (sortKey && sortValue) {
        const listKey = ["title", "timeStart", "timeFinish"];
        const listValue = ["asc", "desc"];

        if (listKey.includes(sortKey) && listValue.includes(sortValue)) {
            sortObject[sortKey] = sortValue;
        } else {
            return res.status(400).json({ message: "Invalid sort key or sort value" });
        }
    }
    // end sort

    // pagination
    const limit = 3;
    const total = await Task.countDocuments(filter);
    const pagination = paginationHelper.pagination(query, limit, total);
    // end pagination

    const tasks = await Task.find(filter)
        .sort(sortObject)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .populate("parentId", "title")
        .populate("createdBy", "fullName email")
        .populate("participants", "fullName email");

    return res.status(200).json({
        message: "Tasks retrieved successfully",
        tasks: tasks,
        pagination: {
            total: total,
            limit: pagination.limit,
            skip: pagination.skip,
            page: pagination.page,
            totalPages: pagination.total
        }
    });
}

// [GET] /api/v1/task/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findOne({
            _id: taskId,
            deleted: false,
            $or: [
                { createdBy: req.currentUser._id },
                { participants: req.currentUser._id }
            ]
        })
            .populate("parentId", "title")
            .populate("createdBy", "fullName email")
            .populate("participants", "fullName email");

        if (task) {
            return res.status(200).json({
                message: "Task retrieved successfully",
                task: task
            });
        } else {
            return res.status(404).json({ message: "Task not found" });
        }
    } catch (error) {
        console.log(1);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// [PATCH] /api/v1/task/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;

        if (!listStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const update = await Task.updateOne(
            {
                _id: id,
                deleted: false,
                $or: [
                    { createdBy: req.currentUser._id },
                    { participants: req.currentUser._id }
                ]
            },
            {
                status: status
            }
        );

        if (update.modifiedCount === 0) {
            return res.status(404).json({ message: "Task not found or status not modified" });
        } else {
            return res.status(200).json({ message: "Status updated successfully" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// [PATCH] /api/v1/task/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const { ids, key, value } = req.body;

        switch (key) {
            case "status":
                if (!listStatus.includes(value)) {
                    return res.status(400).json({ message: "Invalid status value" });
                }

                const update = await Task.updateMany(
                    {
                        _id: { $in: ids },
                        deleted: false,
                        $or: [
                            { createdBy: req.currentUser._id },
                            { participants: req.currentUser._id }
                        ]
                    },
                    {
                        status: value
                    }
                );

                if (update.modifiedCount > 0) {
                    return res.status(200).json({ message: "Status updated successfully" });
                } else {
                    return res.status(404).json({ message: "Tasks not found or status not modified" });
                }

            case "delete":
                if (value !== "true") {
                    return res.status(400).json({ message: "Invalid delete value" });
                }

                const del = await Task.updateMany(
                    {
                        _id: { $in: ids },
                        deleted: false,
                        $or: [
                            { createdBy: req.currentUser._id },
                            { participants: req.currentUser._id }
                        ]
                    },
                    {
                        deleted: true,
                        deletedAt: Date.now()
                    }
                );

                if (del.modifiedCount > 0) {
                    return res.status(200).json({ message: "Tasks deleted successfully" });
                } else {
                    return res.status(404).json({ message: "Tasks not found or already deleted" });
                }

            default:
                return res.status(400).json({ message: "Invalid key" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// [POST] /api/v1/task/create
module.exports.create = async (req, res) => {
    try {
        if (!listStatus.includes(req.body.status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        req.body.timeStart = new Date(req.body.timeStart);
        req.body.timeFinish = new Date(req.body.timeFinish);
        req.body.createdBy = req.currentUser._id;

        const task = new Task(req.body);
        const create = await task.save();

        if (create) {
            return res.status(200).json({ message: "Task created successfully" });
        } else {
            return res.status(500).json({ message: "Failed to create task" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// [PATCH] /api/v1/task/update/:id
module.exports.update = async (req, res) => {
    try {
        const id = req.params.id;

        if (!listStatus.includes(req.body.status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        req.body.timeStart = new Date(req.body.timeStart);
        req.body.timeFinish = new Date(req.body.timeFinish);

        const update = await Task.updateOne(
            {
                _id: id,
                deleted: false,
                $or: [
                    { createdBy: req.currentUser._id },
                    { participants: req.currentUser._id }
                ]
            },
            req.body
        );

        if (update.modifiedCount > 0) {
            return res.status(200).json({ message: "Task updated successfully" });
        } else {
            return res.status(404).json({ message: "Task not found or status not modified" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// [DELETE] /api/v1/task/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;

        const update = await Task.updateOne(
            {
                _id: id,
                deleted: false,
                $or: [
                    { createdBy: req.currentUser._id },
                    { participants: req.currentUser._id }
                ]
            },
            {
                deleted: true,
                deletedAt: Date.now()
            }
        );

        if (update.modifiedCount > 0) {
            return res.status(200).json({ message: "Task marked as deleted" });
        } else {
            return res.status(404).json({ message: "Task not found or already deleted" });
        }

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}