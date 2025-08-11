const Footer = require('./../modle/Footer');

// Create footer
exports.createFooter = async (req, res) => {
  try {
    const {
      description,
      workHours,
      phone,
      address,
      email,
      socialLinks,
      pageLinks,
      customerCareLinks
    } = req.body;

    const footer = new Footer({
      logo: req.file?.filename || '',
      description,
      workHours,
      phone,
      address,
      email,
      socialLinks: JSON.parse(socialLinks || '[]'),
      pageLinks: JSON.parse(pageLinks || '[]'),
      customerCareLinks: JSON.parse(customerCareLinks || '[]')
    });

    await footer.save();
    res.status(201).json(footer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all footers
exports.getFooter = async (req, res) => {
  try {
    const footers = await Footer.find().sort({ createdAt: -1 }); // get all
    res.status(200).json(footers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get footer by ID
exports.getFooterById = async (req, res) => {
  try {
    const footer = await Footer.findById(req.params.id);
    if (!footer) return res.status(404).json({ message: 'Footer not found' });
    res.status(200).json(footer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update footer
exports.updateFooter = async (req, res) => {
  try {
    const {
      description,
      workHours,
      phone,
      address,
      email,
      socialLinks,
      pageLinks,
      customerCareLinks
    } = req.body;

    const updatedData = {
      description,
      workHours,
      phone,
      address,
      email,
      socialLinks: JSON.parse(socialLinks || '[]'),
      pageLinks: JSON.parse(pageLinks || '[]'),
      customerCareLinks: JSON.parse(customerCareLinks || '[]')
    };

    if (req.file) {
      updatedData.logo = req.file.filename;
    }

    const updated = await Footer.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updated) return res.status(404).json({ message: 'Footer not found' });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete footer
exports.deleteFooter = async (req, res) => {
  try {
    const footer = await Footer.findByIdAndDelete(req.params.id);
    if (!footer) return res.status(404).json({ message: 'Footer not found' });
    res.status(200).json({ message: "Footer deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
