const Testimonial = require('./../modle/Testimonial');


exports.createTestimonial = async (req, res) => {
  try {
    // Clean the body field keys
    const cleanBody = {};
    for (let key in req.body) {
      cleanBody[key.trim()] = req.body[key];
    }

    const testimonial = new Testimonial({
      name: cleanBody.name,
      location: cleanBody.location,
      message: cleanBody.message,
      answer: cleanBody.answer,
      image: req.file?.filename || '',
    });

    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// READ all testimonials
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.status(200).json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ one testimonial by ID
exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
    res.status(200).json(testimonial);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE a testimonial
exports.updateTestimonial = async (req, res) => {
  try {
    const updatedData = {
      name: req.body.name,
      location: req.body.location,
      message: req.body.message,
      answer: req.body.answer, // ✅ added
    };
    if (req.file) {
      updatedData.image = req.file.filename;
    }

    const updated = await Testimonial.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updated) return res.status(404).json({ message: 'Testimonial not found' });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE a testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Testimonial not found' });

    res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
