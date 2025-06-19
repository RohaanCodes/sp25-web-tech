const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { ensureGuest, ensureAuth } = require('../middlewares/authMiddleware');

// GET Register
router.get('/register', ensureGuest, (req, res) => {
  res.render('auth/register', { title: 'Register' });
});

// POST Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const user = new User({
      name,
      email,
      password,
      role: role || 'user'  // default to 'user' if not provided
    });

    await user.save();

    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // Redirect based on role
    if (user.role === 'admin') {
  return res.redirect('/admin'); // ✅ correct dashboard route
    }
 else {
      res.redirect('/products');
    }

  } catch (err) {
    res.send('Error: ' + err.message);
  }
});

// GET Login
router.get('/login', ensureGuest, (req, res) => {
  res.render('auth/login', { title: 'Login' });
});

// POST Login
// POST Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate('cart.product');

  if (!user) return res.send('User not found');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.send('Incorrect password');

  // Save user info and cart in session
  req.session.user = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  // Load cart from DB into session
  req.session.cart = user.cart.map(item => ({
    product: item.product,
    quantity: item.quantity
  })) || [];

  if (user.role === 'admin') {
    return res.redirect('/admin/products');
  } else {
    return res.redirect('/products');
  }
});


// GET Logout
router.get('/logout', ensureAuth, (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
