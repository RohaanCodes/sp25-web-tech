const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { ensureAuth } = require('../middlewares/authMiddleware');

// GET Checkout Page
router.get('/checkout', ensureAuth, (req, res) => {
  const cart = req.session.cart || [];
  res.render('pages/checkout', { cart, orderPlaced: false, title: 'Checkout' });
});

// POST Confirm Order
router.post('/checkout/confirm', ensureAuth, async (req, res) => {
  const cart = req.session.cart || [];
  const { phone, address, payLater } = req.body;

  if (cart.length === 0) {
    return res.redirect('/checkout');
  }

  try {
    const orderProducts = cart.map(item => ({
      product: item.product._id,
      quantity: item.quantity
    }));

    const deliveryDays = Math.floor(Math.random() * 4) + 2; // 2–5 days

    const newOrder = new Order({
      user: req.session.user._id,
      products: orderProducts,
      phone,
      address,
      payLater: payLater === 'on',
      deliveryDays
    });

    await newOrder.save();
    req.session.cart = [];

    res.render('pages/checkout', {
      cart: [],
      orderPlaced: true,
      deliveryDays,
      title: 'Checkout'
    });
  } catch (err) {
    res.status(500).send('Error placing order: ' + err.message);
  }
});


// GET My Orders Page
router.get('/my-orders', ensureAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.session.user._id })
      .populate('products.product')
      .sort({ createdAt: -1 });

    res.render('user/myOrders', { orders, title: 'My Orders' });
  } catch (err) {
    res.status(500).send('Error fetching orders: ' + err.message);
  }
});

module.exports = router;
