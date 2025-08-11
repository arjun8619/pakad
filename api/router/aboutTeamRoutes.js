// router/aboutTeamRoutes.js
const express = require('express');
const router = express.Router();
const { upload } = require('./../multer/userController'); // ✅ correct import
const ctrl = require('./../controllers/aboutTeamController');

router.post('/about-team', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'playstoreImage', maxCount: 1 },
]), ctrl.createAboutTeam);

router.get('/about-team', ctrl.getAboutTeam);

router.put('/about-team/:id', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'playstoreImage', maxCount: 1 },
]), ctrl.updateAboutTeam);

router.delete('/about-team/:id', ctrl.deleteAboutTeam);

module.exports = router;
