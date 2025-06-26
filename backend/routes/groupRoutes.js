const express = require("express");
const router = express.Router();
const { createGroup, getMyGroups } = require("../controllers/groupControllers");
const protect = require("../middleware/authMiddleware");

router.post("/create", protect, createGroup);
router.get("/my-groups", protect, getMyGroups);

module.exports = router;
