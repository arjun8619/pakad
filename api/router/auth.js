// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Hash the password '12345678' just once
const hashedPassword = bcrypt.hashSync('12345678', 10);

const hardcodedUser = {
  email: 'admin123@gmail.com',
  password: hashedPassword, // ✅ Store hashed password
};

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email !== hardcodedUser.email) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, hardcodedUser.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const token = jwt.sign({ email: hardcodedUser.email }, 'yourSecretKey', { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
