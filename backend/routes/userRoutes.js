const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", protect, async (req, res) => {
  res
    .status(200)
    .json({ message: "You recieved a protected route!", userId: req.user });
});

module.exports = router;
