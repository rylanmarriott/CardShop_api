const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cardRoutes = require("./routes/cardRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

const enforceJsonContentType = (req,res,next) => {
    if (req.method === "POST" || req.method === "PUT") {
        if (!req.headers["content-type"] || !req.headers["content-type"].includes("application/json")) {
            return res.status(400).json({ message: "Content-Type must be application/json" });
        }
    }
    next();
}

app.use(cors());
app.use(bodyParser.json());
app.use(enforceJsonContentType);
app.use(express.json());


app.use("/api/cards", cardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

module.exports = app;
