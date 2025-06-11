const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  stocks: {
    type: Number,
    required: true,
    min: 0
  },
  units: {
    type: String,
    required: true
  },
  restocked: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['in stock', 'low stock', 'out of stock'],
    default: 'in stock'
  }
});

module.exports = mongoose.model('Inventory', InventorySchema);