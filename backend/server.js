require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;


const InventoryRoutes = require('./routes/InventoryRoutes');
const MenuRoutes = require('./routes/MenuRoutes');
const SalesRoutes = require('./routes/SalesRoutes');
const AuthRoutes = require('./routes/AuthRoutes');
const { verifyToken, isAdmin, isCashier } = require('./middleware/AuthMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const mapper = '/api/v1';

app.use(mapper + '/auth', AuthRoutes);
app.use(mapper + '/inventory', verifyToken, isAdmin, InventoryRoutes);
app.use(mapper + '/menu', verifyToken, isCashier, MenuRoutes);
app.use(mapper + '/sales', verifyToken, isAdmin, SalesRoutes);



mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));