// routes/pizzas.js
const express = require('express');
const router = express.Router();
const Pizza = require('../models/Pizza');
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');

// 🔓 Public: Get all pizzas
router.get('/', async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.json(pizzas);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pizzas' });
  }
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

module.exports = router;
