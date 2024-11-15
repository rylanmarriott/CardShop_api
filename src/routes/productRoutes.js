const express = require("express");
const {
    getAllProducts,
    getProductById,
    purchaseProduct,
} = require("../controllers/productController");

const router = express.Router();

router.get("/all", getAllProducts); // Get all products
router.get("/:id", getProductById); // Get product by ID
router.post("/purchase", purchaseProduct); // Purchase a product

module.exports = router;
