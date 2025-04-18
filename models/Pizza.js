const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Pizza = require('../models/Pizza');
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');


const pizzaSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
});

// 🔒 Admin-only: Add a new pizza
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { name, description, price, image } = req.body;

    const newPizza = new Pizza({ name, description, price, image });
    await newPizza.save();

    res.status(201).json({ message: 'Pizza created successfully', pizza: newPizza });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while creating pizza' });
  }
});


module.exports = mongoose.model('Pizza', pizzaSchema);
