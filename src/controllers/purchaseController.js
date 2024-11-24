const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createPurchase = async (req, res) => {
    const {
        street,
        city,
        province,
        country,
        postal_code,
        credit_card,
        credit_expire,
        credit_cvv,
        cart,
        invoice_amt,
        invoice_tax,
        invoice_total,
    } = req.body;

    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized: You must be logged in to complete a purchase"});
    }

    if (
        !street || !city || !province || !country || !postal_code ||
        !credit_card || !credit_expire || !credit_cvv ||
        !cart || !invoice_amt || !invoice_tax || !invoice_total
    ) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const productCounts = {};
        cart.split(",").forEach((productId) => {
            productCounts[productId] = (productCounts[productId] || 0) + 1;
        });

        const purchase = await prisma.$transaction(async (prisma) => {
            const newPurchase = await prisma.purchase.create({
                data: {
                    customer_id: req.session.user.customer_id,
                    street,
                    city,
                    province,
                    country,
                    postal_code,
                    credit_card,
                    credit_expire,
                    credit_cvv,
                    invoice_amt,
                    invoice_tax,
                    invoice_total,
                },
            });

            const purchaseItems = [];
            for (const [product_id, quantity] of Object.entries(productCounts)) {
                purchaseItems.push({
                    purchase_id: newPurchase.purchase_id,
                    product_id: parseInt(product_id, 10),
                    quantity,
                });
            }

            await prisma.purchaseItem.createMany({
                data: purchaseItems,
            });

            return newPurchase;
        });

        res.status(201).json({ message: "Purchase completed successfully", purchase });
    } catch (err) {
        console.error("Error processing purchase:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { createPurchase };