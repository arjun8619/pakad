const mongoose = require("mongoose");

const headerSchema = new mongoose.Schema(
  {
    logo: { type: String },
    playstore: { type: String },
    links: [
      {
        label: { type: String },
        url: { type: String }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Header", headerSchema);
