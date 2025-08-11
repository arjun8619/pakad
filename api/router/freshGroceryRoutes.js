const express = require('express');
const router = express.Router();
const { upload } = require('./../multer/userController');
const freshCtrl = require('./../controllers/freshGroceryController');

// CREATE
router.post('/fresh-grocery', upload.fields([
  { name: 'playstoreImage', maxCount: 1 },
  { name: 'bannerImage', maxCount: 1 }
]), freshCtrl.createFreshGrocery);

// READ
router.get('/fresh-grocery', freshCtrl.getFreshGroceries);

// UPDATE
router.put('/fresh-grocery/:id', upload.fields([
  { name: 'playstoreImage', maxCount: 1 },
  { name: 'bannerImage', maxCount: 1 }
]), freshCtrl.updateFreshGrocery);

// DELETE
router.delete('/fresh-grocery/:id', freshCtrl.deleteFreshGrocery);

module.exports = router;
