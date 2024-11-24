const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const cardRoutes = require("./routes/cardRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");

const app = express();

const enforceJsonContentType = (req,res,next) => {
    if (req.method === "POST" || req.method === "PUT") {
        if (!req.headers["content-type"] || !req.headers["content-type"].includes("application/json")) {
            return res.status(400).json({ message: "Content-Type must be application/json" });
        }
    }
    next();
};

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

app.use(session({
    secret: "VeryInsecureTestKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    },
}));

app.use(bodyParser.json());
app.use(enforceJsonContentType);
app.use(express.json());
app.use(express.static("public"));


app.use("/api/cards", cardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/purchases", purchaseRoutes);


module.exports = app;
