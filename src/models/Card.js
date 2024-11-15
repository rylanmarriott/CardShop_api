const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    rarity: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
});

module.exports = mongoose.model("Card", CardSchema);
