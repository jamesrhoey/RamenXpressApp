const Inventory = require('../models/Inventory');

// Get all inventory items
const getInventory = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
};

// Add a new inventory item
const addInventory = async (req, res) => {
  try {
    const { name, stocks, units, restocked, status } = req.body;
    const newItem = new Inventory({
      name,
      stocks,
      units,
      restocked,
      status
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add inventory item' });
  }
};

module.exports = {
  getInventory,
  addInventory
};