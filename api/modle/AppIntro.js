const mongoose = require('mongoose');

const appIntroSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  description: { type: String, required: true },
  mobileImage: { type: String }, // for the phone image
  playstoreImage: { type: String } // for playstore logo
}, { timestamps: true });

module.exports = mongoose.model('AppIntro', appIntroSchema);
