const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { ensureGuest, ensureAuth } = require('../middlewares/authMiddleware');

// GET /products
router.get('/products',ensureAuth, async (req, res) => {
  try {
    const products = await Product.find();
    res.render('pages/products', { title: 'Products', products });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
