const mongoose = require('mongoose');

const aboutTeamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // for abouts image
  playstoreImage: { type: String }, // for playstore logo
}, { timestamps: true });

module.exports = mongoose.model('AboutTeam', aboutTeamSchema);

