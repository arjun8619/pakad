const AboutTeam = require('./../modle/AboutTeam');

exports.createAboutTeam = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.files?.image?.[0]?.filename;
    const playstoreImage = req.files?.playstoreImage?.[0]?.filename;

    const newEntry = new AboutTeam({
      title,
      description,
      image,
      playstoreImage,
    });

    await newEntry.save();
    res.status(201).json({ success: true, data: newEntry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAboutTeam = async (req, res) => {
  try {
    const data = await AboutTeam.find();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateAboutTeam = async (req, res) => {
  try {
    const { title, description } = req.body;
    const updateData = { title, description };

    if (req.files?.image?.[0]?.filename) {
      updateData.image = req.files.image[0].filename;
    }
    if (req.files?.playstoreImage?.[0]?.filename) {
      updateData.playstoreImage = req.files.playstoreImage[0].filename;
    }

    const updated = await AboutTeam.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteAboutTeam = async (req, res) => {
  try {
    await AboutTeam.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
