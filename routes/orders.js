const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');

// 🔒 Place order (user must be logged in)
router.post('/', auth, async (req, res) => {

  console.log('🔥 Incoming order:', req.body);
  console.log('🧑‍💻 User:', req.user);
  try {
    const { items, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in order' });
    }

    const newOrder = new Order({
      user: req.user.userId, // from token
      items,
      total
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Order creation failed' });
  }
});

// 🔒 View orders by user (must be same logged-in user)
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).populate('items.pizzaId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});


// 🔒 Admin: View all orders
router.get('/all', auth, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('items.pizzaId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch all orders' });
  }
});

module.exports = router;
