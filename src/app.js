const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cardRoutes = require("./routes/cardRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/cards", cardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

module.exports = app;
