const authMiddleware = require("../middlewares/auth");

const taskRoutes = require("./task.route");
const userRoutes = require("./user.route");

module.exports = (app) => {
    const prefix = "/api/v1";

    app.use(prefix + "/task", authMiddleware.checkToken({ tokenName: 'token', type: 'currentUser' }), taskRoutes);
    app.use(prefix + "/user", userRoutes);
}