const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const TAX_RATE = 0.15;

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

        const productIds = Object.keys(productCounts).map((id) => parseInt(id, 10));

        const products = await prisma.product.findMany({
            where: { product_id: { in: productIds } },
        });

        if (products.length !== productIds.length) {
            return res.status(400).json({ message: "Some products in the cart are invalid" });
        }

        let invoiceAmt = 0;
        const purchaseItems = products.map((product) => {
            const quantity = productCounts[product.product_id];
            const subtotal = product.cost * quantity;
            invoiceAmt += subtotal;

            return {
                purchase_id: undefined,
                product_id: product.product_id,
                quantity,
            };
        });

        const invoiceTax = invoiceAmt * TAX_RATE;
        const invoiceTotal = invoiceAmt + invoiceTax;

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
                    invoice_amt: invoiceAmt,
                    invoice_tax: invoiceTax,
                    invoice_total: invoiceTotal,
                },
            });

            purchaseItems.forEach((item) => {
                item.purchase_id = newPurchase.purchase_id;
            });
            
            await prisma.purchaseItem.createMany({
                data:purchaseItems,
            });
            
            return newPurchase;
        });

        res.status(201).json({ message: "Purchase completed successfully", 
            purchase: {
                purchase_id: purchase.purchase_id,
                invoice_amt: purchase.invoice_amt,
                invoice_tax: purchase.invoice_tax,
                invoice_total: purchase.invoice_total,
                order_date: purchase.order_date,
        },
     });
    } catch (err) {
        console.error("Error processing purchase:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { createPurchase };