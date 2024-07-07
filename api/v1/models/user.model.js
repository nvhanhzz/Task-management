const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        deleted: {
            type: Boolean,
            default: false
        }
        // phone
        // avatar
        // status
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;