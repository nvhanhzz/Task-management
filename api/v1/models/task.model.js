const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        status: { type: String, required: true },
        content: { type: String, required: true },
        timeStart: { type: Date, required: true },
        timeFinish: { type: Date, required: true },
        createBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        deleted: { type: Boolean, default: false },
        deletedAt: { type: Date },
    },
    { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema, "tasks");

module.exports = Task;
