const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "This field is required"],
  },
  email: {
    type: String,
    required: [true, "This field is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "This field is required"],
  },
  profilePic: {
    type: String,
    default: "",
  },
  watchlist: [
    {
      id: Number,
      title: String,
      poster_path: String,
    },
  ],

  favourites: {
    type: [Number],

    default: [],
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
