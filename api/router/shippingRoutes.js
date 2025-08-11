const express = require('express');
const router = express.Router();
const { upload } = require('./../multer/userController');
const {
  createShipping,
  getShipping,
  updateShipping,
  deleteShipping
} = require('./../controllers/shippingController');

router.post('/create', upload.single('image'), createShipping);
router.get('/', getShipping);
router.put('/:id', upload.single('image'), updateShipping);
router.delete('/:id', deleteShipping);

module.exports = router;
