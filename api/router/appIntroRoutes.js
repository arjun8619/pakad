const express = require('express');
const router = express.Router();
const { upload } = require('./../multer/userController');
const appIntroCtrl = require('./../controllers/appIntroController');

// Upload middleware for mobileImage and playstoreImage
const appIntroUpload = upload.fields([
  { name: 'mobileImage', maxCount: 1 },
  { name: 'playstoreImage', maxCount: 1 }
]);

router.post('/app-intro', appIntroUpload, appIntroCtrl.createAppIntro);
router.get('/app-intro', appIntroCtrl.getAppIntros);
router.put('/app-intro/:id', appIntroUpload, appIntroCtrl.updateAppIntro);
router.delete('/app-intro/:id', appIntroCtrl.deleteAppIntro);

module.exports = router;
