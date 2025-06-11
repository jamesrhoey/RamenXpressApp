const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin, isCashier } = require('../middleware/AuthMiddleware');
const { register, login, logout, getCurrentUser } = require('../controllers/AuthController');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', verifyToken, getCurrentUser);

// Role-based routes
router.get('/admin', verifyToken, isAdmin, (req, res) => {
  res.json({ message: 'Admin access granted' });
});

// Cashier route (accessible by both cashier and admin)
router.get('/cashier', verifyToken, isCashier, (req, res) => {
  res.json({ message: 'Cashier access granted' });
});

// Protected route (accessible by any authenticated user)
router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Protected route accessed' });
});

module.exports = router;
