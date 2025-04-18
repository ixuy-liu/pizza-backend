const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type:     { type: String, enum: ['admin', 'customer'], default: 'customer' }
}, {
  timestamps: true,
  collection: 'pizzaUsers'   // 👈 this is the custom collection name
});

module.exports = mongoose.model('User', userSchema);
