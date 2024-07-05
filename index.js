const express = require("express");
require("dotenv").config();
const app = express();

const database = require("./config/database");
const port = process.env.PORT;

const route = require("./api/v1/routes/index.route");

database.connect();

route(app);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});