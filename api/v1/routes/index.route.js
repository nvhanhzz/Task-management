const authMiddleware = require("../middlewares/auth");

const taskRoutes = require("./task.route");
const userRoutes = require("./user.route");

module.exports = (app) => {
    const prefix = "/api/v1";
    app.use(authMiddleware.checkToken({ tokenName: 'token', type: 'currentUser' }));

    app.use(prefix + "/task", authMiddleware.isLoggedIn, taskRoutes);
    app.use(prefix + "/user", userRoutes);
}