const express = require("express");
require("dotenv").config();
const app = express();
const bodyParser = require('body-parser');

const database = require("./config/database");
const port = process.env.PORT;

const route = require("./api/v1/routes/index.route");

database.connect();

// parse application/json
app.use(bodyParser.json());

route(app);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});