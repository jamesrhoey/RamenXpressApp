const express = require('express');
const router = express.Router();
const { createMenuItem, getAllMenus, editMenuItem, deleteMenuItem, getMenusByCategory } = require('../controllers/MenuConctroller');

router.post('/create', createMenuItem);  // Create new menu item
router.get('/allmenu', getAllMenus);  // Get all menu items
router.put('/edit/:id', editMenuItem);
router.delete('/delete/:id', deleteMenuItem);
router.get('/category/:category', getMenusByCategory);

module.exports = router;