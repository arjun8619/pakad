const path = require('path');
const multer = require('multer');
// const User = require('./../modle/User'); // Still needed for user routes

// Storage for category/user images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // will be accessible via /uploads path
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname).toLowerCase();
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedTypes = ['.jpg', '.jpeg', '.png', '.webp',".svg"];
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, jpeg, png, webp).'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Example user handler (can be skipped if unused)
exports.createUser = async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      image: req.file?.filename || '',
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Export multer upload middleware
exports.upload = upload;
