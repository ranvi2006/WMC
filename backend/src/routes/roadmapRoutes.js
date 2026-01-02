const express = require("express");
const router = express.Router();

const { uploadRoadmap } = require("../controllers/roadmapController");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");
const pdfUpload = require("../middlewares/pdfUpload");

router.post(
  "/upload",
  isAuthenticated,
  pdfUpload.single("roadmap"),
  uploadRoadmap
);

module.exports = router;
