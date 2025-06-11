const express = require('express');
const router = express.Router();
const { getInventory, addInventory } = require('../controllers/InventoryController');

// GET all inventory items
router.get('/all', getInventory);

// POST a new inventory item
router.post('/add', addInventory);

module.exports = router;