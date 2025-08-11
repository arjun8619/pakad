// router/authRoutes.js or a new router file
const express = require('express');
const router = express.Router();

router.post('/logout', (req, res) => {
  // If using cookie/session
  res.clearCookie('token'); // Use your cookie name here if any

  // If using localStorage, no cookie to clear
  return res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
