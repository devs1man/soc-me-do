const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("api/groups", groupRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
