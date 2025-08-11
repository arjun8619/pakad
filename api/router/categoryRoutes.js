const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { upload } = require('./../multer/userController');
const Category = require('./../modle/Category');

// POST: Add new category
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { label } = req.body;

    if (!label) {
      return res.status(400).json({ error: 'Label is required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const newCategory = new Category({
      label,
      image: req.file.filename
    });

    await newCategory.save();

    res.status(201).json({
      message: 'Category added successfully',
      category: newCategory
    });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET: Fetch all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// PUT: Update category by ID
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { label } = req.body;
    const updateData = {};

    if (label) updateData.label = label;
    if (req.file) updateData.image = req.file.filename;

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({
      message: 'Category updated successfully',
      category: updatedCategory
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// DELETE: Delete category by ID
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Delete image file from uploads folder
    const imagePath = path.join(__dirname, '../uploads', category.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;
