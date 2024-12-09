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
    const { id } = req.params;

    if (!Number.isInteger(Number(id))) {
        return res.status(400).json({ message: "Product ID must be an integer" });
    }

    try {
        const product = await prisma.product.findUnique({
            where: { product_id: parseInt(id) },
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (err) {
        console.error("Error fetching product by ID:", err.message);
        res.status(500).json({ message: err.message });
    }
};

const purchaseProduct = async (req, res) => {
    const { cart } = req.body;

    if (!cart || typeof cart !== "string") {
        return res.status(400).json({ message: "Cart is required and must be a comma-separated string" });
    }

    try {
        // Parse the cart into product IDs and quantities
        const productCounts = {};
        cart.split(",").forEach((productId) => {
            productCounts[productId] = (productCounts[productId] || 0) + 1;
        });

        const productIds = Object.keys(productCounts).map((id) => parseInt(id, 10));

        // Fetch products from the database
        const products = await prisma.product.findMany({
            where: { product_id: { in: productIds } },
        });

        if (products.length !== productIds.length) {
            return res.status(400).json({ message: "Some products in the cart are invalid" });
        }

        // Calculate the total cost
        let totalCost = 0;
        products.forEach((product) => {
            const quantity = productCounts[product.product_id];
            totalCost += product.cost * quantity;
        });

        res.status(200).json({
            message: "Purchase successful",
            totalCost,
        });
    } catch (err) {
        console.error("Error processing purchase:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { getAllProducts, getProductById, purchaseProduct };