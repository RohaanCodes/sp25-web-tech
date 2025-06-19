const express = require('express');
const router = express.Router();

const Vehicle = require('../models/Vehicle');
router.get('/vehicles', async (req, res) => {
  const vehicles = await Vehicle.find();
  res.render('pages/vehicles', { vehicles, title: 'All Vehicles', layout: 'admin/layoutAdmin' });
});
module.exports = router;