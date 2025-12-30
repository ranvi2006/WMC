const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

router.post("/", auth, require("../controllers/counselingController").bookCounseling);

module.exports = router;
