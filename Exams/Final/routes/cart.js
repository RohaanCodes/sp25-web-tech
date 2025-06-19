const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const { ensureAuth } = require('../middlewares/authMiddleware');

// Helper to sync session cart with DB
async function saveCartToDB(userId, cart) {
  const cartForDB = cart.map(item => ({
    product: item.product._id,
    quantity: item.quantity
  }));
  await User.findByIdAndUpdate(userId, { cart: cartForDB });
}

// Add product to cart
router.post('/cart/add', ensureAuth, async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).send('Product not found');

  if (!req.session.cart) req.session.cart = [];

  const cart = req.session.cart;
  const existingIndex = cart.findIndex(item => item.product._id.toString() === productId);

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ product, quantity: 1 });
  }

  await saveCartToDB(req.session.user._id, cart);
  res.redirect('/cart');
});

// View Cart
router.get('/cart', ensureAuth, async (req, res) => {
  let cart = req.session.cart || [];

  // If session cart empty, load from DB
  if (cart.length === 0) {
    const user = await User.findById(req.session.user._id).populate('cart.product');
    cart = user.cart.map(item => ({
      product: item.product,
      quantity: item.quantity
    }));
    req.session.cart = cart;
  }

  res.render('pages/cart', { title: 'Your Cart', cart });
});

// Remove product
router.post('/cart/remove', ensureAuth, async (req, res) => {
  const { productId } = req.body;
  if (!req.session.cart) return res.redirect('/cart');

  req.session.cart = req.session.cart.filter(item => item.product._id.toString() !== productId);
  await saveCartToDB(req.session.user._id, req.session.cart);
  res.redirect('/cart');
});

// Update quantity
router.post('/cart/update', ensureAuth, async (req, res) => {
  const { productId, quantity } = req.body;
  if (!req.session.cart) return res.redirect('/cart');

  const cart = req.session.cart;
  const index = cart.findIndex(item => item.product._id.toString() === productId);
  if (index !== -1) {
    cart[index].quantity = parseInt(quantity) || 1;
  }

  await saveCartToDB(req.session.user._id, cart);
  res.redirect('/cart');
});

module.exports = router;
