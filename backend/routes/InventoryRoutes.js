const express = require('express');
const router = express.Router();
const { getInventory, addInventory, updateInventoryQuantity, deleteInventory, editInventory } = require('../controllers/InventoryController');


router.get('/all', getInventory);
router.post('/add', addInventory);
router.put('/update/:id', updateInventoryQuantity);
router.delete('/delete/:id', deleteInventory);
router.put('/edit/:id', editInventory);

module.exports = router;