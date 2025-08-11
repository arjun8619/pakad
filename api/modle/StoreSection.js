const mongoose = require('mongoose');

const storeSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  features: [
    {
      iconClass: { type: String },
      heading: { type: String },
      subtext: { type: String }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('StoreSection', storeSectionSchema);
