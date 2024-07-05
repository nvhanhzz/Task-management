const taskRoutes = require("./task.route");

module.exports = (app) => {
    const prefix = "/api/v1";

    app.use(prefix + "/task", taskRoutes);
}