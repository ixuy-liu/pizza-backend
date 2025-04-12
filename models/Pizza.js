const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
});

module.exports = mongoose.model('Pizza', pizzaSchema);
