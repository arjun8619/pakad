const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    image: { type: String }, // filename only
  },
  { timestamps: true }
);

module.exports = mongoose.model('Faq', faqSchema);
