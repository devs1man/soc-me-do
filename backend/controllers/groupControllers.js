const Group = require("../models/Group");
const { registerUser } = require("./userController");

const createGroup = async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: "Group name is required" });

  try {
    const newGroup = await Group.create({
      name,
      members: [req.user._id],
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Group created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to create group" });
  }
};

const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id }).populate(
      "members",
      "name email"
    );
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch groups" });
  }
};

module.exports = { createGroup, getMyGroups };
