const User = require("../models/User");

const registerUser = async (req, res) => {
  console.log("i am in");
  console.log("request body", req.body);
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const newUser = await User.create({ name, email, password });

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill in all the fields" });
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

//when searching for the users for group creation
const searchUsers = async (req, res) => {
  const query = req.query.query;

  if (!query)
    return res.status(400).json({ message: "Search query is required" });

  try {
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
      _id: { $ne: req.user._id },
    }).select("-password");
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to search user", error: err.message });
  }
};

const toggleWatchlist = async (req, res) => {
  console.log("TOGGLEWATCHLIST HIT!");
  try {
    const userId = req.params.userId;
    const movie = req.body.movie;
    if (!movie || !movie.tmdbId) {
      return res.status(400).json({ message: "Invalis movie data" });
    }
    const tmdbId = movie.tmdbId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const index = user.watchlist.findIndex((item) => item.tmdbId === tmdbId);
    console.log("Toggle watchlist request body:", req.body);
    if (index > -1) {
      user.watchlist.splice(index, 1);
    } else {
      user.watchlist.push(tmdbId);
    }
    console.log("Before save:", user.watchlist);
    await user.save();
    res.status(200).json(user.watchlist);
  } catch (error) {
    console.error("togglewatchlist error: ", error.message);
    console.error(error.stack);
    res.status(500).json({ message: "Server error" });
  }
};

const toggleFavourites = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { tmdbId } = req.body.movie;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const index = user.favourites.findIndex((item) => item.tmdbId === tmdbId);
    if (index > -1) {
      user.favourites.splice(index, 1);
    } else {
      user.favourites.push(tmdbId);
    }
    await user.save();
    res.status(200).json(user.favourites);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getProfile = async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    watchlist: user.watchlist,
    favourites: user.favourites,
    watchlistCount: user.watchlist.length,
    favouritesCount: user.favourites.length,
  });
};

module.exports = {
  registerUser,
  loginUser,
  searchUsers,
  toggleFavourites,
  toggleWatchlist,
  getProfile,
};
