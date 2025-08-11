const express = require("express");
const router = express.Router();
const { upload } = require("../multer/userController");
const {
  createHeader,
  getHeader,
  updateHeader,
  deleteHeader,
} = require("../controllers/headerController");

router.post(
  "/header",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "playstore", maxCount: 1 },
  ]),
  createHeader
);

router.get("/header", getHeader);

router.put(
  "/header/:id",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "playstore", maxCount: 1 },
  ]),
  updateHeader
);

router.delete("/header/:id", deleteHeader);

module.exports = router;
