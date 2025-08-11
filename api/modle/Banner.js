const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  title: String,
  description: String,
  backgroundImg: String,
  rightSideImg: String,
});

module.exports = mongoose.model("Banner", bannerSchema);
