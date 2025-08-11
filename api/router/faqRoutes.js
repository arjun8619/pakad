const express = require('express');
const router = express.Router();
const { upload } = require('../multer/userController');
const faqCtrl = require('../controllers/faqController');

router.post('/faq', upload.single('image'), faqCtrl.createFaq);
router.get('/faq', faqCtrl.getAllFaqs);
router.put('/faq/:id', upload.single('image'), faqCtrl.updateFaq);
router.delete('/faq/:id', faqCtrl.deleteFaq);

module.exports = router;
