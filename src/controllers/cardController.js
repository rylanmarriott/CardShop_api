const Card = require("../models/Card");

const getAllCards = async (req, res) => {
    try {
        const cards = await Card.find();
        res.status(200).json(cards);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getCardById = async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).json({ message: "Card not found" });
        res.status(200).json(card);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createCard = async (req, res) => {
    try {
        const newCard = new Card(req.body);
        const savedCard = await newCard.save();
        res.status(201).json(savedCard);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateCard = async (req, res) => {
    try {
        const updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updatedCard) return res.status(404).json({ message: "Card not found" });
        res.status(200).json(updatedCard);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteCard = async (req, res) => {
    try {
        const deletedCard = await Card.findByIdAndDelete(req.params.id);
        if (!deletedCard) return res.status(404).json({ message: "Card not found" });
        res.status(200).json({ message: "Card deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllCards, getCardById, createCard, updateCard, deleteCard };
