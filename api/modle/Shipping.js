const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  iconClass: { type: String }, // e.g. "fa-solid fa-truck-fast"
  image: { type: String }, // optional for uploaded image
});

module.exports = mongoose.model("Shipping", shippingSchema);
