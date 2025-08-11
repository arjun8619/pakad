const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema({
  logo: { type: String }, // logo image filename
  description: { type: String },
  workHours: { type: String },
  phone: { type: String },
  address: { type: String },
  email: { type: String },
  socialLinks: [String], // e.g. ["https://facebook.com", "https://twitter.com"]
  pageLinks: [String],   // e.g. ["About Us", "Services", ...]
  customerCareLinks: [String]
}, { timestamps: true });

module.exports = mongoose.model('Footer', footerSchema);
