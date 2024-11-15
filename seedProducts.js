const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const seedProducts = async () => {
    try {
        const products = [
            { name: "Black Lotus", description: "A rare and powerful card.", cost: 20000, image_filename: "blacklotus.jpg" },
            { name: "Mox Sapphire", description: "A jewel of untapped potential.", cost: 8000, image_filename: "moxsapphire.jpg" },
            { name: "Ancestral Recall", description: "Draw three cards for one mana.", cost: 6000, image_filename: "ancestralrecall.jpg" },
            { name: "Time Walk", description: "Take an extra turn for just two mana.", cost: 5000, image_filename: "timewalk.jpg" },
            { name: "Tarmogoyf", description: "A creature whose power and toughness grow with the graveyard.", cost: 200, image_filename: "tarmogoyf.jpg" },
            { name: "Liliana of the Veil", description: "A planeswalker with discard power.", cost: 150, image_filename: "lilianaoftheveil.jpg" },
            { name: "Snapcaster Mage", description: "Flashback your spells.", cost: 120, image_filename: "snapcastermage.jpg" },
            { name: "Lightning Bolt", description: "Deal 3 damage for one red mana.", cost: 10, image_filename: "lightningbolt.jpg" },
            { name: "Mana Crypt", description: "A zero-cost artifact that adds two mana.", cost: 200, image_filename: "manacrypt.jpg" },
            { name: "Sol Ring", description: "The most efficient mana generator in Magic.", cost: 5, image_filename: "solring.jpg" },
        ];

        for (const product of products) {
            await prisma.product.create({
                data: product,
            });
        }

        console.log("Products seeded successfully!");
        await prisma.$disconnect();
    } catch (error) {
        console.error("Error seeding products:", error.message);
        await prisma.$disconnect();
        process.exit(1);
    }
};

seedProducts();
