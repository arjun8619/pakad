const Banner = require("./../modle/Banner");
const fs = require("fs");
const path = require("path");

exports.createBanner = async (req, res) => {
  try {
    const { title, description } = req.body;

    const backgroundImg = req.files?.backgroundImg?.[0]?.filename || null;
    const rightSideImg = req.files?.rightSideImg?.[0]?.filename || null;

    const banner = new Banner({
      title,
      description,
      backgroundImg,
      rightSideImg,
    });

    await banner.save();

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      banner,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.getBanner = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json({
      success: true,
      banners,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id;

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ success: false, error: "Banner not found" });
    }

    // Delete old images if new ones are uploaded
    if (req.files?.backgroundImg?.[0]) {
      if (banner.backgroundImg) {
        fs.unlinkSync(path.join(__dirname, "..", "uploads", banner.backgroundImg));
      }
      banner.backgroundImg = req.files.backgroundImg[0].filename;
    }

    if (req.files?.rightSideImg?.[0]) {
      if (banner.rightSideImg) {
        fs.unlinkSync(path.join(__dirname, "..", "uploads", banner.rightSideImg));
      }
      banner.rightSideImg = req.files.rightSideImg[0].filename;
    }

    banner.title = title || banner.title;
    banner.description = description || banner.description;

    await banner.save();

    res.json({
      success: true,
      message: "Banner updated successfully",
      banner,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, error: "Banner not found" });
    }

    // Delete associated images
    if (banner.backgroundImg) {
      fs.unlink(path.join(__dirname, "..", "uploads", banner.backgroundImg), () => {});
    }

    if (banner.rightSideImg) {
      fs.unlink(path.join(__dirname, "..", "uploads", banner.rightSideImg), () => {});
    }

    await banner.deleteOne();

    res.json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
