const express = require('express');
const router = express.Router();
const { placeOrder, getSales, getSalesByDateRange } = require('../controllers/SalesController');

router.post('/order', placeOrder);
router.get('/allSales', getSales);
router.get('/range', getSalesByDateRange);

module.exports = router;
