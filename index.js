const uploadRoutes = require('./routes/upload');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const pizzaRoutes = require('./routes/pizzas');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/users', userRoutes);     
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});


// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.log('MongoDB connection error:', err));
