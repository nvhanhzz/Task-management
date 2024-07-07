const taskRoutes = require("./task.route");
const userRoutes = require("./user.route");

module.exports = (app) => {
    const prefix = "/api/v1";

    app.use(prefix + "/task", taskRoutes);
    app.use(prefix + "/user", userRoutes);
}