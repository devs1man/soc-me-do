const express = require("express");
const router = express.Router();
const {
  createGroup,
  getMyGroups,
  inviteToGroup,
} = require("../controllers/groupControllers");
const protect = require("../middleware/authMiddleware");

router.post("/create", protect, createGroup);
router.post("/invite", protect, inviteToGroup);

router.get("/my-groups", protect, getMyGroups);
router.get("/test", protect, (req, res) => {
  res.json({ message: "middleware is working", user: req.user });
});

module.exports = router;
