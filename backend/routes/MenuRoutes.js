const express = require('express');
const router = express.Router();
const { createMenuItem, getAllMenus } = require('../controllers/MenuConctroller');

router.post('/create', createMenuItem);  // Create new menu item
router.get('/allmenu', getAllMenus);  // Get all menu items

module.exports = router;