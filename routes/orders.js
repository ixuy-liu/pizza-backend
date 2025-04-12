const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/authMiddleware'); // ⬅️ import the middleware

// 🔒 Place order (user must be logged in)
router.post('/', auth, async (req, res) => {
  try {
    const { items, total } = req.body;
    const newOrder = new Order({
      userId: req.user.userId, // pulled from token
      items,
      total
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// 🔒 View orders by user (must be same logged-in user)
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).populate('items.pizzaId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
