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

module.exports = { getAllProducts, getProductById };
