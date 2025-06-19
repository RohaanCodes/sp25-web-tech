const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, enum: ['sedan', 'SUV', 'truck'], required: true },
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
