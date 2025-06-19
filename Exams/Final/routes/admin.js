const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const { ensureAdmin } = require('../middlewares/authMiddleware');
const Vehicle = require('../models/Vehicle');
const multer = require('multer');
const path = require('path');
//VEHICLES
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/vehicles'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// View all vehicles (Admin)
router.get('/admin/vehicles', ensureAdmin, async (req, res) => {
  const vehicles = await Vehicle.find();
  res.render('admin/vehicleList', { vehicles, title: 'Manage Vehicles', layout: 'admin/layoutAdmin' });
});

// Add Vehicle Form
router.get('/admin/vehicles/new', ensureAdmin, (req, res) => {
  res.render('admin/addVehicle', { title: 'Add Vehicle', layout: 'admin/layoutAdmin' });
});

// Create Vehicle
router.post('/admin/vehicles', ensureAdmin, upload.single('image'), async (req, res) => {
  const { name, brand, price, type } = req.body;
  const image = req.file ? '/uploads/vehicles/' + req.file.filename : '';
  await Vehicle.create({ name, brand, price, type, image });
  res.redirect('/admin/vehicles');
});

// Edit Vehicle Form
router.get('/admin/vehicles/:id/edit', ensureAdmin, async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  res.render('admin/editVehicle', { vehicle, title: 'Edit Vehicle', layout: 'admin/layoutAdmin' });
});

// Update Vehicle
router.post('/admin/vehicles/:id', ensureAdmin, upload.single('image'), async (req, res) => {
  const { name, brand, price, type } = req.body;
  const update = { name, brand, price, type };
  if (req.file) update.image = '/uploads/vehicles/' + req.file.filename;
  await Vehicle.findByIdAndUpdate(req.params.id, update);
  res.redirect('/admin/vehicles');
});

// Delete Vehicle
router.post('/admin/vehicles/:id/delete', ensureAdmin, async (req, res) => {
  await Vehicle.findByIdAndDelete(req.params.id);
  res.redirect('/admin/vehicles');
});





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
