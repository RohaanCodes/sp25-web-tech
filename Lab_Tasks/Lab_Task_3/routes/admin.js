const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const { ensureAdmin } = require('../middlewares/authMiddleware');

// Admin Dashboard Route
router.get('/admin', ensureAdmin, (req, res) => {
  res.render('admin/adminDashboard', {title: 'Admin Dashboard', layout: 'admin/layoutAdmin' });
});


// GET all products for admin
router.get('/admin/products', ensureAdmin, async (req, res) => {
  const products = await Product.find();
  res.render('admin/productList', { products, title: 'Manage Products', layout: 'admin/layoutAdmin' });
});

// Add Product Form
router.get('/admin/products/new', ensureAdmin, (req, res) => {
  res.render('admin/addProduct', { title: 'Add Product', layout: 'admin/layoutAdmin' });
});

// Create Product
router.post('/admin/products', ensureAdmin, async (req, res) => {
  const { title, price, description, imageUrl } = req.body;
  await Product.create({ title, price, description, imageUrl });
  res.redirect('/admin/products');
});

// Edit Product Form
router.get('/admin/products/:id/edit', ensureAdmin, async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render('admin/editProduct', { product, title: 'Edit Product', layout: 'admin/layoutAdmin' });
});

// Update Product
router.post('/admin/products/:id', ensureAdmin, async (req, res) => {
  const { title, price, description, imageUrl } = req.body;
  await Product.findByIdAndUpdate(req.params.id, { title, price, description, imageUrl });
  res.redirect('/admin/products');
});

// Delete Product
router.post('/admin/products/:id/delete', ensureAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/admin/products');
});

// View all orders
router.get('/admin/orders', ensureAdmin, async (req, res) => {
  const orders = await Order.find().populate('products.product').populate('user');
  res.render('admin/orderList', { orders, title: 'All Orders', layout: 'admin/layoutAdmin' });
});

module.exports = router;
