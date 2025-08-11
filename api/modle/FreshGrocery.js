const mongoose = require('mongoose');

const freshGrocerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  playstoreImage: { type: String },
  bannerImage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("FreshGrocery", freshGrocerySchema);
