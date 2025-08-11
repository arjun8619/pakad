const Shipping = require("./../modle/Shipping");
const fs = require('fs');
const path = require('path');

exports.createShipping = async (req, res) => {
  try {
    const { title, description, iconClass } = req.body;
    const image = req.file ? req.file.filename : null;

    const shipping = new Shipping({ title, description, iconClass, image });
    await shipping.save();
    res.status(201).json(shipping);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.getShipping = async (req, res) => {
//   try {
//     const data = await Shipping.find();
//     res.json({ data });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
exports.getShipping = async (req, res) => {
  try {
    const data = await Shipping.find();

    // Prepend full image URL to each image
    const updatedData = data.map(item => ({
      ...item._doc,
      imageUrl: item.image ? `${req.protocol}://${req.get('host')}/uploads/${item.image}` : null
    }));

    res.json({ data: updatedData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateShipping = async (req, res) => {
  try {
    const { title, description, iconClass } = req.body;
    const updateData = { title, description, iconClass };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updated = await Shipping.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updated) return res.status(404).json({ error: "Shipping item not found" });

    res.json({ message: "Updated successfully", item: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteShipping = async (req, res) => {
  try {
    const item = await Shipping.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    // Delete the image from uploads folder
    if (item.image) {
      const filePath = path.join(__dirname, '..', 'uploads', item.image);
      fs.unlink(filePath, err => {
        if (err) console.warn('Image delete error:', err.message);
      });
    }

    await item.deleteOne();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
