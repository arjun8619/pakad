const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createUser, getUsers } = require('./../multer/userController');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Routes
router.post('/', upload.single('image'), createUser);
router.get('/', getUsers);

module.exports = router;
