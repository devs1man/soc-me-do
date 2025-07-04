const Group = require("../models/Group");
const { registerUser } = require("./userController");

const createGroup = async (req, res) => {
  console.log("protect middleware is running");
  const { name } = req.body;

  if (!name)
    return res.status(400).json({ message: "Please fill in all the fields" });

  try {
    console.log("REQ.USER:", req.user);
    console.log("TYPEOF REQ.USER: ", typeof req.user);
    const newGroup = await Group.create({
      name,
      members: [req.user._id],
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Group created successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create group", error: err.message });
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

//admin inviting
const inviteToGroup = async (req, res) => {
  const { groupId, userId } = req.body;

  if (!groupId || !userId)
    return res.status(400).json({ message: "Missing requirements" });

  try {
    const group = await Group.findById(groupId);

    if (!groupId) return res.status(404).json({ message: "Group not found" });

    if (!group.createdBy.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Only group creators can invite users" });
    }
    if (group.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User is already a group memeber" });
    }

    if (group.invited.includes(userId)) {
      return res.status(400).json({ message: "User already invited" });
    }

    group.invited.push(userId);
    await group.save();

    res.json({ message: "User invited successfully" });
  } catch (err) {
    res.status(500).json({ message: "INvite failed", error: err.message });
  }
};

//for the other end
const getMyInvites = async (req, res) => {
  try {
    const invites = await Group.find({ invited: req.user._id })
      .populate("createdBy", "name email")
      .select("name createdBy");
    res.json(invites);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch invites", error: err.message });
  }
};

const acceptInvite = async (req, res) => {
  const groupId = req.params.id;

  try {
    const group = await Group.findById(groupId);

    if (!group) return res.status(400).json({ message: "Group not found" });

    if (!group.invited.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You are not invited to this group" });
    }
    group.invited = group.invited.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    group.members.push(req.user._id);
    await group.save();

    res.json({ message: "You have joined the group!" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Accepting invite failed", error: err.message });
  }
};

const rejectInvite = async (req, res) => {
  const groupId = req.params.id;

  try {
    const group = await Group.findById(groupId);

    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.invited.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You are not invited to this group" });
    }
    group.invited = group.invited.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    await group.save();
    res.json({ message: "You have rejected the invited" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Rejecting invite failed", error: err.message });
  }
};

module.exports = {
  createGroup,
  getMyGroups,
  inviteToGroup,
  getMyInvites,
  acceptInvite,
  rejectInvite,
};
