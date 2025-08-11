const FreshGrocery = require('./../modle/FreshGrocery');

// CREATE
exports.createFreshGrocery = async (req, res) => {
  try {
    const { title, subtitle, description } = req.body;

    const playstoreImage = req.files['playstoreImage']?.[0]?.filename;
    const bannerImage = req.files['bannerImage']?.[0]?.filename;

    const newItem = new FreshGrocery({
      title,
      subtitle,
      description,
      playstoreImage,
      bannerImage
    });

    await newItem.save();
    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// READ (All)
exports.getFreshGroceries = async (req, res) => {
  try {
    const data = await FreshGrocery.find();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// READ (Single by ID)
exports.getFreshGroceryById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await FreshGrocery.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE
exports.updateFreshGrocery = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description } = req.body;

    const updates = {
      title,
      subtitle,
      description
    };

    if (req.files['playstoreImage']) {
      updates.playstoreImage = req.files['playstoreImage'][0].filename;
    }

    if (req.files['bannerImage']) {
      updates.bannerImage = req.files['bannerImage'][0].filename;
    }

    const updatedItem = await FreshGrocery.findByIdAndUpdate(id, updates, {
      new: true
    });

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({ success: true, data: updatedItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE
exports.deleteFreshGrocery = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FreshGrocery.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
