const express = require("express");
const router = express.Router();
const {
  createGroup,
  getMyGroups,
  inviteToGroup,
  getMyInvites,
  acceptInvite,
  rejectInvite,
} = require("../controllers/groupControllers");
const protect = require("../middleware/authMiddleware");

router.post("/create", protect, createGroup);
router.post("/invite", protect, inviteToGroup);
router.post("/:id/accept", protect, acceptInvite);
router.post("/:id/reject", protect, rejectInvite);

router.get("/my-groups", protect, getMyGroups);
router.get("/test", protect, (req, res) => {
  res.json({ message: "middleware is working", user: req.user });
});
router.get("/invites", protect, getMyInvites);

module.exports = router;
