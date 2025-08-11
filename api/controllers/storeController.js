const StoreSection = require('./../modle/StoreSection');

exports.createStoreSection = async (req, res) => {
  try {
    const { title, subtitle, description, features } = req.body;

    const image = req.file ? req.file.filename : null;

    const parsedFeatures = JSON.parse(features); // Expecting array from frontend

    const data = new StoreSection({
      title,
      subtitle,
      description,
      image,
      features: parsedFeatures
    });

    await data.save();
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getStoreSection = async (req, res) => {
  try {
    const data = await StoreSection.find();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateStoreSection = async (req, res) => {
  try {
    const { title, subtitle, description, features } = req.body;
    const { id } = req.params;

    const image = req.file ? req.file.filename : undefined;

    const updateData = {
      title,
      subtitle,
      description,
      features: JSON.parse(features)
    };
    if (image) updateData.image = image;

    const updated = await StoreSection.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteStoreSection = async (req, res) => {
  try {
    await StoreSection.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
