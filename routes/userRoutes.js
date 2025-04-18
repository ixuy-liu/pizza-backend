const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// REGISTER — Admin or Customer
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, type } = req.body;
    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    // Validate user type
    const validTypes = ['admin', 'customer'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: "Invalid user type. Must be 'admin' or 'customer'." });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a digit, and a special character.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword, type });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// LOGIN — Email + Password
const jwt = require('jsonwebtoken');
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    // ✅ Generate a token with role
    const token = jwt.sign(
      { userId: user._id, role: user.type },  // 👈 role included here
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        fullName: user.fullName,
        email: user.email,
        type: user.type
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
