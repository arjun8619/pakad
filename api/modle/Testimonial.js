const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  message: { type: String, required: true },
  answer: { type: String }, // <-- Add this line
  image: { type: String },  // stored filename
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
