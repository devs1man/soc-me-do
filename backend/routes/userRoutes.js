const express = require("express");
const router = express.Router();
const User = require("../models/User");

const {
  registerUser,
  loginUser,
  searchUsers,
  toggleFavourites,
  toggleWatchlist,
  getProfile,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/:userId/watchlist", protect, toggleWatchlist);
router.post("/:userId/favourites", protect, toggleFavourites);
router.get("/:userId/profile", protect, getProfile);
router.post("/register", (req, res) => {
  res.json({ message: "test works" });
});
{
  /*router.get("/profile", protect, async (req, res) => {
  res
    .status(200)
    .json({ message: "You recieved a protected route!", userId: req.user });
});*/
}
router.get("/search", protect, searchUsers);

module.exports = router;
