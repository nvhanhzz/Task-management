const User = require("../api/v1/models/user.model");

module.exports.getUserInformation = async (task) => {
    try {
        if (task.createdBy) {
            task.createdBy = await User.findOne({
                _id: task.createdBy
            }).select("fullName email");
        }

        if (task.participants && task.participants.length > 0) {
            const users = await User.find({
                _id: { $in: task.participants }
            }).select("fullName email");
            task.participants = users;
        }
    } catch (error) {
        console.error('Error retrieving user information:', error);
    }
}
