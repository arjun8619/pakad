const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");
const { upload } = require("../multer/userController"); // ✅ Destructure upload properly

// Upload background and right-side images
router.post('/create', upload.fields([
  { name: "backgroundImg", maxCount: 1 },
 
]), bannerController.createBanner);

 
router.get("/", bannerController.getBanner);
router.put(
  '/:id',
  upload.fields([{ name: 'backgroundImg' }, { name: 'rightSideImg' }]),
  bannerController.updateBanner
);

router.delete('/:id', bannerController.deleteBanner);

module.exports = router;
