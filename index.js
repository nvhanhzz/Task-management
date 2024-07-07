const express = require("express");
const cors = require('cors');
require("dotenv").config();
const app = express();
app.use(cors());
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