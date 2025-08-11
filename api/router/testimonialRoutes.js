// // routes/testimonialRoutes.js
// const express = require('express');
// const router = express.Router();
// const testimonialCtrl = require('./../controllers/testimonialController');
// const {upload} = require('./../multer/userController');



const express = require('express');
const router = express.Router();
 const testimonialCtrl = require('./../controllers/testimonialController');
 const {upload} = require('./../multer/userController');

router.post('/testimonial', upload.single('image'), testimonialCtrl.createTestimonial);
router.get('/testimonial', testimonialCtrl.getTestimonials);
router.get('/testimonial:id', testimonialCtrl.getTestimonialById);
router.put('/testimonial:id', upload.single('image'), testimonialCtrl.updateTestimonial);
router.delete('/testimonial:id', testimonialCtrl.deleteTestimonial);

module.exports = router;
