const AppIntro = require('./../modle/AppIntro');

// Create
exports.createAppIntro = async (req, res) => {
  try {
    const { heading, description } = req.body;
    const mobileImage = req.files['mobileImage']?.[0]?.filename;
    const playstoreImage = req.files['playstoreImage']?.[0]?.filename;

    const newIntro = new AppIntro({
      heading,
      description,
      mobileImage,
      playstoreImage
    });

    await newIntro.save();
    res.status(201).json({ success: true, data: newIntro });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Read
exports.getAppIntros = async (req, res) => {
  try {
    const data = await AppIntro.find();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update
exports.updateAppIntro = async (req, res) => {
  try {
    const { heading, description } = req.body;
    const updates = { heading, description };

    if (req.files['mobileImage']) {
      updates.mobileImage = req.files['mobileImage'][0].filename;
    }
    if (req.files['playstoreImage']) {
      updates.playstoreImage = req.files['playstoreImage'][0].filename;
    }

    const updated = await AppIntro.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete
exports.deleteAppIntro = async (req, res) => {
  try {
    await AppIntro.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
