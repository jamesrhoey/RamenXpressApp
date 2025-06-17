const Menu = require('../models/Menu');
const Inventory = require('../models/Inventory');

// Get all menu items
const getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find().sort({ category: 1, name: 1 });
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get menu items by category
const getMenusByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const menus = await Menu.find({ category }).sort({ name: 1 });
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create a new menu item
const createMenuItem = async (req, res) => {
  console.log('createMenuItem called with:', req.body);
  try {
    const { name, price, category, image, ingredients } = req.body;

    // Validate required fields
    if (!name || !price || !category || !image || !ingredients) {
      return res.status(400).json({ 
        message: 'Name, price, category, image, and ingredients are required' 
      });
    }

    // Validate price is positive
    if (price <= 0) {
      return res.status(400).json({ 
        message: 'Price must be greater than 0' 
      });
    }

    // Validate category
    const validCategories = ['ramen', 'rice bowls', 'side dishes', 'sushi', 'party trays', 'add-ons', 'drinks'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        message: 'Invalid category. Must be one of: ' + validCategories.join(', ')
      });
    }

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
      category,
      image,
      ingredients
    });

    await menuItem.save();
    console.log('Menu item saved:', menuItem);
    res.status(201).json({ 
      message: 'Menu item created successfully',
      menuItem 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Edit menu item
const editMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, image, ingredients } = req.body;

    // Validate required fields
    if (!name || !price || !category || !image || !ingredients) {
      return res.status(400).json({ 
        message: 'Name, price, category, image, and ingredients are required' 
      });
    }

    // Validate price is positive
    if (price <= 0) {
      return res.status(400).json({ 
        message: 'Price must be greater than 0' 
      });
    }

    // Validate category
    const validCategories = ['ramen', 'rice bowls', 'side dishes', 'sushi', 'party trays', 'add-ons', 'drinks'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        message: 'Invalid category. Must be one of: ' + validCategories.join(', ')
      });
    }

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

    // Find and update the menu item
    const updatedMenuItem = await Menu.findByIdAndUpdate(
      id,
      { name, price, category, image, ingredients },
      { new: true, runValidators: true }
    );

    if (!updatedMenuItem) {
      return res.status(404).json({ 
        message: 'Menu item not found' 
      });
    }

    res.status(200).json({ 
      message: 'Menu item updated successfully',
      menuItem: updatedMenuItem 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete menu item
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMenuItem = await Menu.findByIdAndDelete(id);
    
    if (!deletedMenuItem) {
      return res.status(404).json({ 
        message: 'Menu item not found' 
      });
    }

    res.status(200).json({ 
      message: 'Menu item deleted successfully',
      menuItem: deletedMenuItem 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  createMenuItem,
  getAllMenus,
  getMenusByCategory,
  editMenuItem,
  deleteMenuItem
}; 