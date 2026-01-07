const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/sign-up', async (req, res) => {
  try {
    const { username, password } = req.body
    const userInDatabase = await User.findOne({ username });

    if (userInDatabase) {
      return res.status(409).json({ err: 'Invalid username or password' });
    }

    const hashPassword = bcrypt.hashSync(password, 10);
    req.body.password = hashPassword;

    const user = await User.create(req.body);

    const payload = {
      username: user.username,
      _id: user._id,
      role: user.role,
      wantToBeSeller: user.wantToBeSeller,
      cart: user.cart,
      cartTotal: user.cartTotal
    };

    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    res.status(201).json({ token });
  } catch (error) {
    console.log(error);
  }
});

router.post('/sign-in', async (req, res) => {
  try {
    const { username, password } = req.body;

    const userInDatabase = await User.findOne({ username });

    if (!userInDatabase) {
      return res.status(401).json({ err: 'Invalid Credentials' });
    }

    if (userInDatabase.wantToBeSeller && userInDatabase.role !== "seller") {
      return res.status(401).json({ err: 'Seller Request Pending' });
    }

    const isValidPassword = bcrypt.compareSync(password, userInDatabase.password);

    if (!isValidPassword) {
      return res.status(401).json({ err: 'Invalid Credentials' });
    }

    const payload = {
      username: userInDatabase.username,
      _id: userInDatabase._id,
      role: userInDatabase.role,
      wantToBeSeller: userInDatabase.wantToBeSeller,
      cart: userInDatabase.cart,
      cartTotal: userInDatabase.cartTotal
    };

    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    res.status(200).json({ token });
  } catch (err) {
    console.log(err);

    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
