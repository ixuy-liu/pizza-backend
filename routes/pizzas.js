const express = require('express');
const router = express.Router();
const Pizza = require('../models/Pizza');
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');

// Get all pizzas
router.get('/', async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.json(pizzas);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pizzas' });
  }
});

router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const newPizza = new Pizza(req.body);
    await newPizza.save();
    res.status(201).json(newPizza);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add pizza' });
  }
});

module.exports = router;
