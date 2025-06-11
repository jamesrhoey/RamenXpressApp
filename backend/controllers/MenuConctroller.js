const Menu = require('../models/Menu');
const Inventory = require('../models/Inventory');

// Get all menu items
const getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find().sort({ name: 1 });
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create a new menu item
const createMenuItem = async (req, res) => {
  try {
    const { name, price, ingredients } = req.body;

    // Validate that all ingredients exist in inventory
    const ingredientNames = ingredients.map(i => i.inventoryItem);
    const inventoryItems = await Inventory.find({ name: { $in: ingredientNames } });
    
    if (inventoryItems.length !== ingredientNames.length) {
      return res.status(400).json({ 
        message: 'Some ingredients do not exist in inventory',
        missingIngredients: ingredientNames.filter(name => 
          !inventoryItems.some(item => item.name === name)
        )
      });
    }

    const menuItem = new Menu({
      name,
      price,
      ingredients
    });

    await menuItem.save();
    res.status(201).json({ 
      message: 'Menu item created successfully',
      menuItem 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  createMenuItem,
  getAllMenus
};
