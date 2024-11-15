const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cardRoutes = require("./routes/cardRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/cards", cardRoutes);

module.exports = app;
