const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
        res.status(500).json({ message: "Internal server error" });
    }
};

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        // Fetch product by ID 
        const product = { id: productId, name: `Product ${productId}`, price: 10 };

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const purchaseProduct = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ message: "Product ID and quantity are required" });
        }

        // Simulate product purchase 
        const product = { id: productId, name: `Product ${productId}`, price: 10 };

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const totalPrice = product.price * quantity;

        res.status(200).json({
            message: "Product purchased successfully",
            product,
            quantity,
            totalPrice,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllProducts, getProductById, purchaseProduct };
