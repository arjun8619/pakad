const Faq = require('../modle/faq');
const fs = require('fs');
const path = require('path');

exports.createFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const image = req.file ? req.file.filename : null;

    const faq = new Faq({ question, answer, image });
    await faq.save();

    res.status(201).json({ message: 'FAQ created', data: faq });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create FAQ' });
  }
};

exports.getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ createdAt: -1 });
    res.json({ data: faqs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
};

exports.updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    const faq = await Faq.findById(id);
    if (!faq) return res.status(404).json({ error: 'FAQ not found' });

    // Remove old image if new one is uploaded
    if (req.file && faq.image) {
      fs.unlinkSync(path.join(__dirname, '../uploads', faq.image));
    }

    faq.question = question;
    faq.answer = answer;
    if (req.file) faq.image = req.file.filename;

    await faq.save();
    res.json({ message: 'FAQ updated', data: faq });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};

exports.deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await Faq.findByIdAndDelete(id);
    if (faq?.image) {
      fs.unlinkSync(path.join(__dirname, '../uploads', faq.image));
    }
    res.json({ message: 'FAQ deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};
