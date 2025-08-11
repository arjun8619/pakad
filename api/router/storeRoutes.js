const express = require('express');
const router = express.Router();
const {upload} = require('./../multer/userController');
const storeCtrl = require('./../controllers/storeController');

// Create
router.post('/store-section', upload.single('image'), storeCtrl.createStoreSection);

// Get all
router.get('/store-section', storeCtrl.getStoreSection);

// Update
router.put('/store-section/:id', upload.single('image'), storeCtrl.updateStoreSection);

// Delete
router.delete('/store-section/:id', storeCtrl.deleteStoreSection);

module.exports = router;
