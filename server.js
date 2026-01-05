const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000

// Controllers ===============================================================================================
const authCtrl = require('./controllers/auth');
const productCtrl = require("./controllers/product")
const orderCtrl = require('./controllers/order');
const userCtrl = require('./controllers/user');

// Middleware ================================================================================================
const verifyToken = require('./middleware/verify-token');

// Connect to DB =============================================================================================
try {
  mongoose.connect(process.env.MONGODB_URI)
  mongoose.connection.on('connected', () => console.log(`Connected to MongoDB ${mongoose.connection.name}.`))  
} catch (err) {
  console.error('Ran into an error: '+err)
}

// Middleware ================================================================================================
app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// Public Routes =============================================================================================
app.use('/auth', authCtrl);
app.use("/users", userCtrl)
app.use("/products", productCtrl)

// Protected Routes ==========================================================================================
app.use(verifyToken)
app.use('/orders', orderCtrl)




// Listiner ==================================================================================================
app.listen(port, () => console.log('Listening on port ' + port))