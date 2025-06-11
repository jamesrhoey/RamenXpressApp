const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  ingredients: [
    {
      inventoryItem: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ]
});

// Static method to get all menu items
MenuSchema.statics.getAllMenus = async function() {
  try {
    const menus = await this.find().sort({ name: 1 });
    return menus;
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('Menu', MenuSchema); 