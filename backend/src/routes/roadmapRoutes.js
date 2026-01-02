const express = require("express");
const router = express.Router();

const upload = require("../middlewares/pdfUpload");
const { uploadRoadmap,getRoadmapByCourse,deleteRoadmapByCourse } = require("../controllers/roadmapController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.post(
  "/upload",
  isAuthenticated,
  upload.single("pdf"), // 👈 field name MUST match frontend
  uploadRoadmap
);
router.get(
  "/course/:courseId",
  isAuthenticated,
  getRoadmapByCourse
);
router.delete(
  "/course/:courseId",
  isAuthenticated,
  deleteRoadmapByCourse
);


module.exports = router;
