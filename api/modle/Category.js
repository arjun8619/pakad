const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  label: { type: String, required: true }, // corrected from "name" to "label"
  image: { type: String, required: true }
});

module.exports = mongoose.model('Category', categorySchema);
