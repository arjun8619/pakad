const express = require('express');
const router = express.Router();
const footerCtrl = require('../controllers/footerController');
const { upload } = require('../multer/userController'); // Must match export above

router.post('/footer', upload.single('logo'), footerCtrl.createFooter);
router.get('/footer', footerCtrl.getFooter);
router.get('/footer/:id', footerCtrl.getFooterById);
router.put('/footer/:id', upload.single('logo'), footerCtrl.updateFooter);
router.delete('/footer/:id', footerCtrl.deleteFooter);

module.exports = router;
